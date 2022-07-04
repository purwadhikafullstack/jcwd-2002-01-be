const { Sequelize } = require("sequelize");
const mysqlConfig = require("../config/database");

const sequelize = new Sequelize({
  username: mysqlConfig.MYSQL_USERNAME,
  password: mysqlConfig.MYSQL_PASSWORD,
  database: mysqlConfig.MYSQL_DB_NAME,
  port: 3306,
  dialect: "mysql",
  logging: false,
});

//models
const User = require("../models/user")(sequelize);
const Admin = require("../models/admin")(sequelize);
const VerificationToken = require("../models/verification_token")(sequelize);
const ForgotPasswordToken = require("../models/forgot_password_token")(
  sequelize
);
const Address = require("../models/address")(sequelize);
const UserLoginSession = require("../models/user_login_session")(sequelize);
const AdminLoginSession = require("../models/admin_login_session")(sequelize);
const Product = require("../models/product")(sequelize);
const Inventory = require("../models/inventory")(sequelize);
const ProductImage = require("../models/product_image")(sequelize);
const Cart = require("../models/cart")(sequelize);
const Category = require("../models/category")(sequelize);
// const ProductCategory = require("../models/product_category")(sequelize);
const Transaction = require("../models/transaction")(sequelize);
const TransactionItem = require("../models/transaction_item")(sequelize);
const Payment = require("../models/payment")(sequelize);
const PurchaseOrder = require("../models/purchase_order")(sequelize);
const MutationStock = require("../models/mutation_stock")(sequelize);

//relation

//1:M user and verification token
VerificationToken.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(VerificationToken, { foreignKey: "user_id" });

//1:M user and forgot password token
ForgotPasswordToken.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(ForgotPasswordToken, { foreignKey: "user_id" });

//1:M user and address
Address.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Address, { foreignKey: "user_id" });

//1:M user and user Login Session
UserLoginSession.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(UserLoginSession, { foreignKey: "user_id" });

//1:M admin and admin Login Session
AdminLoginSession.belongsTo(Admin, { foreignKey: "admin_id" });
Admin.hasMany(AdminLoginSession, { foreignKey: "admin_id" });

//1:M inventory and product
Inventory.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Inventory, { foreignKey: "product_id" });

//1:M product and product image
ProductImage.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductImage, { foreignKey: "product_id" });

//1:M cart and product
Cart.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Cart, { foreignKey: "product_id" });

//1:M cart and user
Cart.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Cart, { foreignKey: "user_id" });

//1:M category and product
Category.hasMany(Product);
Product.belongsTo(Category);

//1:M cart and user
TransactionItem.belongsTo(Transaction, { foreignKey: "transaction_id" });
Transaction.hasMany(TransactionItem, { foreignKey: "transaction_id" });

//1:M payment and transaction
Payment.belongsTo(Transaction, { foreignKey: "transaction_id" });
Transaction.hasMany(Payment, { foreignKey: "transaction_id" });

//1:M purchase order and product
PurchaseOrder.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(PurchaseOrder, { foreignKey: "product_id" });

MutationStock.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(MutationStock, { foreignKey: "product_id" });

module.exports = {
  User,
  Admin,
  VerificationToken,
  ForgotPasswordToken,
  Address,
  UserLoginSession,
  AdminLoginSession,
  Product,
  Inventory,
  ProductImage,
  Cart,
  Category,
  // ProductCategory,
  Transaction,
  TransactionItem,
  Payment,
  PurchaseOrder,
  MutationStock,
  sequelize,
};
