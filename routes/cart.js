const express = require("express");
const multer = require("multer");

const cart = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");

const {
  warnIfNotLogged,
  warnIfNotAdmin,
} = require("../middlewares/user");

const cartRouter = express.Router();

cartRouter.use(User.middleware);
cartRouter.use(warnIfNotLogged);

cartRouter.get("/", async (req, res) => {
  const payload = {
    found: false,
    success: false,
    message: "",
  };

  try {
    const cart = (await Cart.getCart()).unwrap();
    delete cart.id;
    payload.cart = cart;
    payload.found = payload.success = true;
    payload.message = "Cart loaded successfully.";
  } catch (err) {
    res.status(403);
    payload.message = err;
  }

  res.send(payload);
});

cartRouter.post("/", multer().any(), async (req, res) => {
  const { product_id: productId, quantity } = req.body;

  const payload = {
    updated: false,
    success: false,
    message: "",
  };

  try {
    const newQuantity = parseInt(quantity);
    (await Cart.updateQuantity(productId, newQuantity)).unwrap();
    payload.quantity = quantity;
    payload.success = payload.updated = true;
    payload.message = `quantity changed to ${quantity}`;
  } catch (err) {
    res.status(403);
    payload.message = err;
  }

  res.send(payload);
});

cartRouter.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  const payload = {
    removed: false,
    success: false,
    message: "",
  };

  try {
    (await Cart.removeItem(productId)).unwrap();
    payload.removed = payload.success = true;
    payload.message = "Item removed successfully.";
  } catch (err) {
    res.status(403);
    payload.message = err;
  }

  res.send(payload);
});

module.exports = cartRouter;
