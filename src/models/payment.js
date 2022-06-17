const { DataTypes } = require("sequelize");

const Payment = (sequelize) => {
  return sequelize.define("Payment", {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_image: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};

module.exports = Payment;
