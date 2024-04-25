const express = require("express");
const multer = require("multer");

const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");

const {
  warnIfNotLogged,
  warnIfNotAdmin,
} = require("../middlewares/user");

const UPLOADS_DIR = require("../config").UPLOADS_DIR;

const productRouter = express.Router();

productRouter.use(User.middleware);
productRouter.use(warnIfNotLogged);

productRouter.get("/", async (req, res) => {
  const productId = req.query.id;

  const payload = {
    found: false,
    success: false,
    message: "",
  };

  try {
    if (productId) {
      const product = (await Product.getProduct(productId)).unwrap();
      payload.product = product;
      payload.message = "Product loaded successfully.";
    } else {
      const productList = (await Product.getList()).unwrap();
      payload.products = productList;
      payload.message = "Products loaded successfully.";
    }
    payload.found = payload.success = true;
  } catch (err) {
    res.status(403);
    payload.message = err;
  }
  res.send(payload);
});

productRouter.get("/user", async (_req, res) => {
  const currentUser = User.getCurrentUser();

  const payload = {
    found: false,
    success: false,
    message: "",
  };

  try {
    const productList = (await Product.getListOfUser(currentUser)).unwrap();
    payload.products = productList;
    payload.found = payload.success = true;
    payload.message = "Products loaded successfully.";
  } catch (err) {
    res.status(403);
    payload.message = err;
  }
  res.send(payload);
});

productRouter.post("/cart", multer().any(), async (req, res) => {
  const productId = req.body.product_id;

  const payload = {
    found: false,
    success: false,
    message: "",
  };
  try {
    payload.found = true;
    (await Cart.addItem(productId)).unwrap();
    payload.success = true;
    payload.message = "Product added successfully";
  } catch (err) {
    res.status(403);
    payload.message = err;
  }
  res.send(payload);
});

productRouter.use(warnIfNotAdmin);

// deleteproduct
productRouter.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  const payload = {
    found: false,
    removed: false,
    success: false,
    message: "",
  };

  try {
    const product = (await Product.getProduct(productId)).unwrap();
    payload.found = true;
    (await product.remove()).unwrap();
    payload.removed = payload.success = true;
    payload.message = "Product removed successfully.";
  } catch (err) {
    res.status(403);
    payload.message = err;
  }

  res.send(payload);
});

productRouter.use(multer({ dest: UPLOADS_DIR }).single("image"));

productRouter.post("/", async (req, res) => {
  const currentUser = User.getCurrentUser();
  const { name, desc, stock, price } = req.body;
  const file = req.file;

  const product = new Product({
    name,
    desc,
    stock: parseInt(stock),
    price: parseFloat(price),
    imagePath: file?.filename,
    creatorId: currentUser.id,
  });

  const payload = {
    created: false,
    success: false,
    message: "",
  };

  try {
    (await product.save()).unwrap();
    payload.product = product;
    payload.created = payload.success = true;
    payload.message = "Product added successfully.";
  } catch (err) {
    res.status(403);
    payload.message = err;
  }
  res.send(payload);
});

//edit product
productRouter.post("/:id", async (req, res) => {
  const productId = req.params.id;

  const payload = {
    found: false,
    updated: false,
    success: false,
    message: "",
  };
  try {
    const product = (await Product.getProduct(productId)).unwrap();
    payload.found = true;
    const { name, desc, stock, price } = req.body;
    const imagePath = req.file?.filename;
    (await product.updateInfo({
      name,
      desc,
      stock: parseInt(stock),
      price: parseFloat(price),
      imagePath,
    })).unwrap();
    payload.product = product;
    payload.updated = payload.found = true;
    payload.message = "Product updated successfully.";
  } catch (err) {
    res.status(403);
    payload.message = err;
  }

  res.send(payload);
});

module.exports = productRouter;
