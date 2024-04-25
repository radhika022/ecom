const express = require("express");
const multer = require("multer");

const User = require("../models/user");
const {
  warnIfLogged,
  warnIfNotLogged,
} = require("../middlewares/user");

const userRouter = express.Router();

userRouter.use(User.middleware);

userRouter.use(multer().any());

userRouter.post("/", warnIfLogged, async (req, res) => {
  const { email: id, password } = req.body;
  const user = new User({ id, password });
  await user.syncInfo();

  const payload = {
    found: false,
    auth: false,
    success: false,
    message: "",
  };
  if (!user.isRegistred) {
    res.status(404);
    payload.message = "User is not registered.";
  } else if (!user.isAuthentic) {
    res.status(403);
    payload.found = true;
    payload.message = "User's password is incorrect.";
  } else {
    User.login(user);
    payload.found = payload.auth = payload.success = true;
    payload.message = "User logged in successfully.";
  }
  res.send(payload);
});

userRouter.post("/create", warnIfLogged, async (req, res) => {
  const { email: id, name, password, role } = req.body;
  const user = new User({
    id,
    password,
    isAdmin: role === "admin",
    name,
  });
  await user.syncInfo();

  const payload = {
    found: false,
    auth: false,
    success: false,
    message: ""
  };
  if (user.isRegistred) {
    res.status(403);
    payload.found = true;
    payload.message = "User is already registered.";
  } else {
    if (!user.validateInfo()) {
      res.status(403);
      payload.message = "User's info is invalid.";
    } else {
      payload.auth = payload.success = true;
      await user.register();
      payload.message = "User is registered successfully.";
    }
  }
  res.send(payload);
});

userRouter.get("/", warnIfNotLogged, (req, res) => {
  const user = User.getCurrentUser();

  const payload = {
    user: user.name,
    admin: user.isAdmin,
    success: true,
    message: "User loaded successfully."
  };

  res.send(payload);
});

userRouter.post("/password", warnIfNotLogged, async (req, res) => {
  const { old_password, new_password } = req.body;
  const user = User.getCurrentUser();

  const payload = {
    success: false,
    message: ""
  };

  const changed = await user.changePassword(old_password, new_password);
  if (!changed) {
    res.status(403);
    payload.message = "Unable to change password.";
  } else {
    payload.success = true;
    payload.message = "Password changed successfully.";
  }
  res.send(payload);
});

userRouter.delete("/", warnIfNotLogged, (req, res) => {
  User.logout();
  const payload = {
    success: true,
    message: "User is logged out successfully."
  };
  res.send(payload);
});

module.exports = userRouter;
