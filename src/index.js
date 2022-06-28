const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;
const { sequelize } = require("./lib/sequelize");

sequelize.sync({ alter: true });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Final Project API</h1>");
});
const { authRoutes, categoryRoutes, productRoutes } = require("./routes");

app.use("/auth", authRoutes);

const { userRoutes } = require("./routes");

app.use(
  "/profile_images",
  express.static(`${__dirname}/public/profile-picture`)
);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log("Listening in port", PORT);
});
