const express = require("express");
const sequelize= require("../config/database");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
dotenv.config();

// Sync only in production or when needed
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
    .then(() => console.log('Database synced successfully!'))
    .catch((err) => console.error('Error syncing database:', err));
}

const UserRoutes = require("../routes/users");
app.use("/api", UserRoutes);


if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
}

module.exports = app;