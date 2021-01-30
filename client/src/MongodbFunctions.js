const BACKEND_URL = "http://localhost:9000";

export const postNewItem = (token, itemName, itemId, weight, outByDate) => {
  fetch(BACKEND_URL + "/items/addItem", {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify({
      itemName: itemName,
      itemId: itemId,
      weight: weight,
      outByDate: outByDate,
    }),
  }).then((res) => {
    if (res.status !== 202) {
      console.error(res);
    }
  });
};

export const auth = (route, username, password) => {
  return fetch(BACKEND_URL + "/" + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
};

export const signUp = (username, password) => {
  return auth("signup", username, password);
};

export const login = (username, password) => {
  return auth("login", username, password);
};
