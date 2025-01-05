const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(256), allowNull: false },
  mobile_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  address: { type: DataTypes.TEXT },
  post_count: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = User;
