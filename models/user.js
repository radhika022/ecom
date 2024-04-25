const { Result, Option } = require("../utils");
const STORE_MOD_DIR = require("../config").STORE_MOD_DIR;
const {
  User: userStore,
  Cart: cartStore,
} = require(STORE_MOD_DIR);

class User {
  static session = null;

  static middleware(req, _res, next) {
    User.session = req.session;
    next();
  }

  static isLoggedIn() {
    return !!User.session.currentUser;
  }

  static getCurrentUser() {
    const userData = User.session.currentUser;
    const user = new User();
    Object.assign(user, userData);
    return user;
  }

  static logout() {
    User.session.currentUser = null;
  }

  static login(user) {
    User.session.currentUser = user;
  }

  constructor(data = {}) {
    const defaults = {
      id: null,
      name: "User",
      password: null,
      isAdmin: false,
      cartId: null,
    };
    Object.assign(this, defaults, data);
    this.isAuthentic = false;
    this.isRegistred = false;
  }

  validateInfo() {
    return true;
  }

  async syncInfo() {
    const res = await userStore.getUser(this.id);
    if (!res.isOk()) {
      console.error("failed to get User");
    } else {
      const userData = res.unwrap();
      if (!!userData) {
        const { password, ...user } = res.unwrap();
        Object.assign(this, user);
        this.isRegistred = true;
        this.isAuthentic = this.isRegistred && this.password == password;
      }
    }
  }

  async changePassword(oldPass, newPass) {
    if (this.password != oldPass) {
      return false;
    } else {
      this.password = newPass;
      await this.updateInfo();
      return true;
    }
  }

  async register() {
    const { isAuthentic, isRegistred, ...user } = this;
    if (!isRegistred) {
      const maybeId = await cartStore.createCart();
      if (!maybeId.isOk()) {
        console.log("failed to create cart.");
        return Result.Err("failed to create cart.");
      } else {
        const cartId = maybeId.unwrap();
        user.cartId = cartId;
        const res = await userStore.saveUser(user);
        if (!res.isOk()) {
          console.log("failed to register user");
          return Result.Err("failed to register.");
        } else {
          return Result.Ok("");
        }
      }
    }
  }

  async updateInfo() {
    const { isAuthentic, isRegistred, ...user } = this;
    if (isRegistred) {
      const res = await userStore.updateUser(user);
      if (!res.isOk()) {
        console.error("failed to update user");
      }
    }
  }
}

module.exports = User;
