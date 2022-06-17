const { DataTypes } = require("sequelize");

const PurchaseOrder = (sequelize) => {
  return sequelize.define("PurchaseOrder", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
};

module.exports = PurchaseOrder;
