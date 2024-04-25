const { Result, Option } = require("../utils");
const ObjectId = require("mongodb").ObjectId;

const Product = {
  collection: null,

  async getProductList(creatorId = Option.None) {
    const predicate = {};
    if (creatorId.isSome()) {
      predicate.creatorId = creatorId.unwrap();
    }
    try {
      const productList = await Product.collection.find(predicate)
        .map((product) => {
          product.id = product._id;
          delete product._id;
          return product;
        })
        .toArray();

      return Result.Ok(productList);
    } catch (err) {
      return Result.Err("failed to get product list.");
    }
  },

  async saveProduct(productData) {
    try {
      const res = await Product.collection.insertOne(productData);
      const productId = res.insertedId.toString();
      return Result.Ok(productId);
    } catch (err) {
      return Result.Err("failed to save product.");
    }
  },

  async updateProduct(product) {
    try {
      const { id: productId, ...productData } = product;
      await Product.collection.updateOne({ _id: new ObjectId(productId) }, {
        $set: productData,
      });
      return Result.Ok(product);
    } catch (err) {
      return Result.Err("failed to update product.");
    }
  },

  async removeProduct(productId) {
    try {
      await Product.collection.deleteOne({ _id: new ObjectId(productId) });
      return Result.Ok(productId);
    } catch (err) {
      return Result.Err("unable to delete product.");
    }
  },

  async getProduct(productId) {
    try {
      const productData = await Product.collection.findOne({
        _id: new ObjectId(productId),
      }, {
        projection: { _id: 0 },
      });
      if(productData == null){
        return Result.Err("Product not found.");
      }
      productData.id = productId;
      return Result.Ok(productData);
    } catch (err) {
      return Result.Err("unable to get product.");
    }
  },
};

module.exports = Product;
