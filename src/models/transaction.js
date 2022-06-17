const { DataTypes } = require("sequelize");

const Transaction = (sequelize) => {
  return sequelize.define("Transaction", {
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_transaction: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    recipe_image: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

module.exports = Transaction;
