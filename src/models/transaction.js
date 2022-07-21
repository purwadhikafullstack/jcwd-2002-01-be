const { DataTypes } = require("sequelize");

const Transaction = (sequelize) => {
  return sequelize.define("Transaction", {
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status_transaction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recipe_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};
module.exports = Transaction;
