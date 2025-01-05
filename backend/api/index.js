const express = require("express");
const sequelize= require("../config/database");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT;

// Test the database connection
sequelize
  .sync() // Automatically create tables if they don't exist
  .then(() => console.log("Database synced successfully!"))
  .catch((err) => console.error("Error syncing database:", err));

const UserRoutes = require("../routes/users");
app.use("/api", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

module.exports = app;