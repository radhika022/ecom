const express = require("express");
const session = require("express-session");
const path = require("path");

const pageRouter = require("./routes/pages");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");

const {
  PORT,
  STORE_MOD_DIR,
} = require("./config");
const initStore = require(STORE_MOD_DIR).init;

const app = express();

// middlewares

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "this is just me",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes

app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/", pageRouter);

(async function () {
  await initStore();
  app.listen(PORT, () => {
    console.log(`listening at http://127.0.0.1:${PORT}`);
  });
})();
