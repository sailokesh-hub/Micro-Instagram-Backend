const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Post = sequelize.define("Post", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  images: { type: DataTypes.JSONB, defaultValue: [] },
});

// Create a relationship: Post belongs to User
Post.belongsTo(User, { foreignKey: "user_id" });

// After a post is created, increment the post_count for the user
Post.afterCreate(async (post, options) => {
  const user = await User.findByPk(post.user_id);
  if (user) {
    user.increment('post_count');
  }
});

module.exports = Post;
