const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Disable logging; set to console.log for debugging
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Needed for Neon Tech SSL connections
    },
  },
});

sequelize
  .authenticate()
  .then(() => console.log('PostgreSQL connected successfully!'))
  .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
