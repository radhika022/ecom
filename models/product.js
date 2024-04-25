const fs = require("fs").promises;
const { Option, Result } = require("../utils");
const {
  UPLOADS_DIR,
  STORE_MOD_DIR,
} = require("../config");
const productStore = require(STORE_MOD_DIR).Product;

const User = require("./user");
const path = require("path");

class Product {
  constructor(data = {}) {
    const defaults = {
      name: "product",
      id: null,
      desc: "this is description",
      stock: 1,
      price: 1,
      imagePath: "sample",
      creatorId: null,
    };
    Object.assign(this, defaults, data);
  }

  async updateInfo(newInfo, forStock = false) {
    try {
      Product.validateInfo(newInfo).unwrap();

      const currentUser = User.getCurrentUser();
      if (!forStock && this.creatorId != currentUser.id) {
        throw "You're not creator of this product.";
      }

      if (!forStock) {
        // removing old image
        await fs.rm(path.join(UPLOADS_DIR, this.imagePath));
      }

      const info = Object.assign({}, this, newInfo);
      const { isAuthentic, ...product } = info;
      (await productStore.updateProduct(product)).unwrap();
      Object.assign(this, info);
    } catch (err) {
      return Result.Err(err);
    }

    return Result.Ok("Info updated successfully");
  }

  async save() {
    const { id, ...product } = this;
    try {
      Product.validateInfo(product).unwrap();
      const productId = (await productStore.saveProduct(product)).unwrap();
      this.id = productId;
    } catch (err) {
      return Result.Err(err);
    }
    return Result.Ok("Product saved successfully.");
  }

  async remove() {
    try {
      const currentUser = User.getCurrentUser();
      if (this.creatorId != currentUser.id) {
        throw "You're not creator of this product.";
      }

      (await productStore.removeProduct(this.id)).unwrap();
      await fs.rm(path.join(UPLOADS_DIR, this.imagePath));
    } catch (err) {
      return Result.Err(err);
    }
    return Result.Ok("Product removed successfully");
  }

  isAvailable() {
    return this.stock > 0;
  }

  async updateStock(dif) {
    try {
      const changed = this.stock + dif;
      if (changed < 0) {
        throw `Not possible, because stock is ${this.stock}.`;
      }
      const { imagePath, ...newInfo } = this;
      newInfo.stock = changed;
      (await this.updateInfo(newInfo, true)).unwrap();
    } catch (err) {
      return Result.Err(err);
    }
    return Result.Ok("stock updated successfully");
  }

  static validateInfo(info) {
    const { name, desc, stock, price } = info;
    if (name.length < 3 || name.length > 20) {
      return Result.Err("name length be in between 3 and 20");
    }

    if (desc.length < 3 || desc.length > 100) {
      return Result.Err("description length must be in between 3 and 100");
    }

    if (stock < 0) {
      return Result.Err("stock must be positive.");
    }

    if (price < 0) {
      return Result.Err("price must be positive.");
    }

    return Result.Ok("");
  }

  static async getProduct(id) {
    try {
      const productData = (await productStore.getProduct(id)).unwrap();
      productData.stock = parseInt(productData.stock);
      const product = new Product(productData);
      return Result.Ok(product);
    } catch (err) {
      return Result.Err(err);
    }
  }

  static async getList() {
    const res = await productStore.getProductList();
    if (!res.isOk()) {
      console.log("failed to load Products.");
      return Option.None;
    } else {
      const list = res.unwrap();
      return Option.Some(list);
    }
  }

  static async getListOfUser() {
    const currentUser = User.getCurrentUser();
    const res = await productStore.getProductList(Option.Some(currentUser.id));
    if (!res.isOk()) {
      console.log("failed to load Products.");
      return Option.None;
    } else {
      const list = res.unwrap();
      return Option.Some(list);
    }
  }
}

module.exports = Product;
