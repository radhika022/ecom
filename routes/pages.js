const express = require("express");
const path = require("path");
const User = require("../models/user");
const { redirectIfNotLogged, redirectIfLogged, redirectIfNotAdmin } = require("../middlewares/user");

const STATIC_DIR = require("../config").STATIC_DIR;


const pageRouter = express.Router();


pageRouter.use("/static", express.static(STATIC_DIR));

pageRouter.use(User.middleware);

pageRouter.get("/", redirectIfNotLogged, (req, res) => {
  res.redirect("/home");
});

pageRouter.get("/login", redirectIfLogged);

pageRouter.get("/home", redirectIfNotLogged);

pageRouter.get("/register", redirectIfLogged);

pageRouter.get("/add_product", redirectIfNotAdmin);
pageRouter.get("/edit_product", redirectIfNotAdmin);

pageRouter.use("/", express.static(path.join(__dirname, "../pages")));

module.exports = pageRouter;
