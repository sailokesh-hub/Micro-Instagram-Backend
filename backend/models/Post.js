const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Post = sequelize.define("Post", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  images: { type: DataTypes.JSONB, defaultValue: [] }, // JSONB for array of images
});

// Create a relationship: Post belongs to User
Post.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// Increment the post count for the user after a post is created
Post.afterCreate(async (post) => {
  try {
    const user = await User.findByPk(post.user_id);
    if (user) {
      await user.increment("post_count");
    }
  } catch (error) {
    console.error("Error incrementing post count:", error);
  }
});

module.exports = Post;
