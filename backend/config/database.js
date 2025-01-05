const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(isTestEnv ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL, {
  dialect: "postgres",
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
  .then(() => console.log(isTestEnv ? "Connection to test database successful" : "Connection to PostgreSQL successful"))
  .catch((err) => console.error(isTestEnv ? "Failed to connect to test database" : "Failed to connect to PostgreSQL:", err));

module.exports = sequelize;
