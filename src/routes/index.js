const authRoutes = require("./auth");
const userRoutes = require("./user");
const categoryRoutes = require("./category");
const productRoutes = require("./products");
const cartRoutes = require("./cart");
const addressRoutes = require("./address");
const paymentRoutes = require("./payment");
const transactionRoutes = require("./transactions");

module.exports = {
  authRoutes,
  userRoutes,
  categoryRoutes,
  productRoutes,
  cartRoutes,
  addressRoutes,
  paymentRoutes,
  transactionRoutes,
};
