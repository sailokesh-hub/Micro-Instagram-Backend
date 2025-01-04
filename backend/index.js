const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo db Connected"))
  .catch((err) => console.log(err));

const UserRoutes = require("./routes/users");
app.use("/api/users", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
