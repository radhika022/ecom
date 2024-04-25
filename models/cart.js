const { Option, Result } = require("../utils");
const {
  STORE_MOD_DIR,
} = require("../config");
const cartStore = require(STORE_MOD_DIR).Cart;

const User = require("./user");
const Product = require("./product");
const { parse } = require("uuid");

class Cart {
  static getCartId() {
    const currentUser = User.getCurrentUser();
    const cartId = currentUser.cartId;
    return cartId;
  }

  static async getCart() {
    const cartId = Cart.getCartId();
    try {
      const cart = (await cartStore.getCart(cartId)).unwrap();
      cart.id = cartId;
      return Option.Some(cart);
    } catch (err) {
      return Option.None;
    }
  }

  static async getItem(productId) {
    const cartId = Cart.getCartId();
    try {
      const item = (await cartStore.getItem(cartId, productId)).unwrap();
      item.quantity = parseInt(item.quantity);
      return Result.Ok(item);
    } catch (err) {
      return Result.Err(err);
    }
  }

  static async hasProduct(productId) {
    try {
      const cart = (await Cart.getCart()).unwrap();
      return productId in cart;
    } catch (err) {
      return false;
    }
  }

  static validateQuantity(quantity) {
    if (Number.isNaN(quantity)) {
      return Result.Err("quantity must be valid number.");
    }
    if (quantity < 0) {
      return Result.Err("quantity must be positive.");
    }
    return Result.Ok("");
  }

  static async addItem(productId) {
    try {
      const product = (await Product.getProduct(productId)).unwrap();

      if (await Cart.hasProduct(productId)) {
        throw "Already in cart.";
      }

      const cartId = Cart.getCartId();

      (await product.updateStock(-1)).unwrap();
      (await cartStore.insertItem(cartId, {
        id: productId,
        quantity: 1,
      })).unwrap();
    } catch (err) {
      // console.log("failed to add item.");
      return Result.Err(err);
    }
    return Result.Ok("Item Added successfully.");
  }

  static async updateQuantity(productId, newQuantity) {
    try {
      Cart.validateQuantity(newQuantity).unwrap();
      const product = (await Product.getProduct(productId)).unwrap();
      const item = (await Cart.getItem(productId)).unwrap();
      (await product.updateStock(item.quantity - newQuantity)).unwrap();

      const cartId = Cart.getCartId();
      (await cartStore.updateItem(cartId, {
        id: productId,
        quantity: newQuantity,
      })).unwrap();
    } catch (err) {
      return Result.Err(err);
    }
    return Result.Ok("updated quantity successfully.");
  }

  static async removeItem(productId) {
    try {
      const item = (await Cart.getItem(productId)).unwrap();
      const cartId = Cart.getCartId();
      (await cartStore.removeItem(cartId, productId)).unwrap();
      const product = (await Product.getProduct(productId)).unwrap();
      (await product.updateStock(item.quantity)).unwrap();
    } catch (err) {
      return Result.Err(err);
    }
    return Result.Ok("removed successfully.");
  }
}

module.exports = Cart;
