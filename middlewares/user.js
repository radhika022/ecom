const User = require("../models/user");

function warnIfLogged(req, res, next) {
  const payload = {
    auth: true,
    success: false,
    message: "",
  };
  if (User.isLoggedIn()) {
    payload.message = "Already logged in.";
    res
      .status(403)
      .send(payload);
  } else {
    next();
  }
}

function warnIfNotLogged(req, res, next) {
  const payload = {
    auth: false,
    success: false,
    message: "",
  };
  if (!User.isLoggedIn()) {
    payload.message = "You're not logged in";
    res
      .status(404)
      .send(payload);
  } else {
    next();
  }
}

function warnIfNotAdmin(req, res, next) {
  const payload = {
    auth: false,
    success: false,
    message: "",
  };
  if (!User.getCurrentUser().isAdmin) {
    payload.message = "Only admins are allowed.";
    res
      .status(404)
      .send(payload);
  } else {
    next();
  }
}

function redirectIfNotLogged(req, res, next) {
  if (req.url != "/login" && !User.isLoggedIn()) {
    res.redirect("/login");
  } else {
    next();
  }
}

function redirectIfLogged(req, res, next) {
  if (req.url != "/home" && User.isLoggedIn()) {
    res.redirect("/home");
  }
  next();
}

function redirectIfNotAdmin(req, res, next) {
  if(req.url != "/home" && !User.getCurrentUser().isAdmin){
    res.redirect("/home");
  }
  next();
}

module.exports = {
  warnIfLogged,
  warnIfNotLogged,

  warnIfNotAdmin,

  redirectIfLogged,
  redirectIfNotLogged,

  redirectIfNotAdmin
};
