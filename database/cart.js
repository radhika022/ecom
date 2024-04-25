const { Result, Option } = require("../utils");
const ObjectId = require("mongodb").ObjectId;

const Cart = {
  collection: null,

  async createCart() {
    try {
      const res = await Cart.collection.insertOne({});
      const cartId = res.insertedId.toString();
      return Result.Ok(cartId);
    } catch (err) {
      return Result.Err("failed to create cart.");
    }
  },

  async insertItem(cartId, itemData) {
    try {
      const { id: itemId, ...item } = itemData;
      await Cart.collection.updateOne({ _id: new ObjectId(cartId) }, {
        $set: {
          [itemId]: item,
        },
      });
      return Result.Ok(itemId);
    } catch (err) {
      return Result.Err("failed to insert item.");
    }
  },

  async updateItem(cartId, item) {
    try {
      const { id: itemId, ...itemData } = item;
      await Cart.collection.updateOne({ _id: new ObjectId(cartId) }, {
        $set: {
          [new ObjectId(itemId)]: itemData,
        },
      });
      return Result.Ok(item);
    } catch (err) {
      return Result.Err("failed to update item.");
    }
  },

  async removeItem(cartId, itemId) {
    try {
      await Cart.collection.updateOne({ _id: new ObjectId(cartId) }, {
        $unset: {
          [new ObjectId(itemId)]: "",
        },
      });
      return Result.Ok(cartId);
    } catch (err) {
      return Result.Err("failed to remove item.");
    }
  },

  async getItem(cartId, productId) {
    try {
      const res = await Cart.collection.findOne({
        _id: new ObjectId(cartId),
      }, {
        projection: { _id: 0, [productId]: 1 },
      });
      if (!(productId in res)) {
        return Result.Err("product not in cart.");
      }
      const item = Object.assign(res[productId], { id: productId });
      return Result.Ok(item);
    } catch (err) {
      return Result.Err("failed to get item.");
    }
  },

  async getCart(cartId) {
    try {
      const cartData = await Cart.collection.findOne({
        _id: new ObjectId(cartId),
      }, {
        projection: { _id: 0 },
      });
      return Result.Ok(cartData);
    } catch (err) {
      return Result.Err("failed to get cart.");
    }
  },
};

module.exports = Cart;
