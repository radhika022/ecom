const { MongoClient } = require("mongodb");
const User = require("./user");
const Product = require("./product");
const Cart = require("./cart");
const MONGO_URL = require("../config").MONGO_URL;

async function init() {
  const client = new MongoClient(MONGO_URL);
  const connection = await client.connect();
  const db = connection.db("summerTraining");
  User.collection = db.collection("users");
  Product.collection = db.collection("products");
  Cart.collection = db.collection("carts");
}

module.exports = {
  init,
  User,
  Product,
  Cart
};
