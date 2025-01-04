const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres", // Tell Sequelize to use PostgreSQL
  logging: false,
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()

  .then(() => console.log("Connection to PostgreSQL successful"))
  .catch((err) => console.error("Failed to connect to PostgreSQL:", err));

module.exports = sequelize;
