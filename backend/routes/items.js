const express = require("express");
const router = express.Router();

const { Item } = require("../models/item");
const { Batch } = require("../models/batch");
const { toUTCMidnight } = require("../helpers/dateHelpers");
const Assertions = require("../helpers/assertions");

router.get("/getAllItems", async (req, res, next) => {
  const items = (await Item.find({}).sort({name: 1})).map(x => x.toObject());
  const batches = (await Batch.find({}).sort({itemName: 1, outDate: 1})).map(x => x.toObject());

  let batchIndex = 0;

  for (const item of items) {
    // Skip batches corresponding to items with names before this item's name.
    // This loop should only run if there are batches corresponding to items that
    // no longer exist.
    while (batchIndex < batches.length && batches[batchIndex].itemName < item.name) {
      console.warn("Batch does not correspond to any existing item: ", batches[batchIndex]);
      batchIndex++;
    }

    // Add all batches of this item to an array.
    item.batches = [];
    while (batchIndex < batches.length && batches[batchIndex].itemName === item.name) {
      item.batches.push(batches[batchIndex]);
      batchIndex++;
    }
  }

  res.status(200).send(items);
});

router.post("/addItem", async (req, res, next) => {
  // Validate request body fields.
  try {
    Assertions.assertObject(req.body, {
      itemName: Assertions.assertString,
      itemId: Assertions.assertString,
      weight: Assertions.assertNumber,
      outDate: Assertions.assertDateString,
    });
  } catch (e) {
    res.send("body" + e.message, 400);
    return;
  }

  const { itemName, itemId, weight } = req.body;

  const outDate = toUTCMidnight(new Date(req.body.outDate));

  // Use today's date as the in date, unless the out date is in the past.
  // This ensures that the out date >= the in date.
  let inDate = toUTCMidnight();
  if (inDate >= outDate) {
    inDate = outDate;
  }

  // Ensure that the requested item exists.
  let item = await Item.findOne({ name: itemName }).exec();
  if (item === null) {
    item = await new Item({
      name: itemName,
      itemId,
    }).save();
  }

  // Get the batch corresponding to this item and out date,
  // creating a new batch if necessary.
  let batch = await Batch.findOne({ itemName, outDate }).exec();
  if (batch === null) {
    batch = await new Batch({
      itemName,
      inDate,
      outDate,
      poundsTotal: 0,
      poundsRemaining: 0,
    }).save();
  }

  // Add the specified number of pounds to the current batch.
  batch.poundsTotal += weight;
  batch.poundsRemaining += weight;
  await batch.save();

  res.status(202).send();
});

module.exports = router;
