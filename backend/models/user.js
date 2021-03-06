const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  forgotPasswordToken: {
    type: String,
  },
});

const User = model("User", UserSchema);

// export model user with UserSchema
module.exports = { User };
