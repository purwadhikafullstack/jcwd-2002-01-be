const { DataTypes } = require("sequelize");

const TransactionItem = (sequelize) => {
  return sequelize.define("TransactionItem", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

module.exports = TransactionItem;
