const { Result } = require("../utils");

const User = {
  collection: null,

  async getUser(id) {
    try {
      const user = await User.collection.findOne({ id }, {
        projection: { _id: 0 },
      });

      return Result.Ok(user);
    } catch (err) {
      return Result.Err(err);
    }
  },

  async saveUser(user) {
    try {
      await User.collection.insertOne(user);
      return Result.Ok("");
    } catch (err) {
      return Result.Err(err);
    }
  },

  async updateUser(updatedUser) {
    try {
      await User.collection.updateOne({ id: updatedUser.id }, {
        $set: updatedUser,
      });
      return Result.Ok("");
    } catch (err) {
      return Result.Err(err);
    }
  },
};

module.exports = User;
