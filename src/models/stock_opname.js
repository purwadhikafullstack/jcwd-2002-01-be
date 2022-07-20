const { DataTypes } = require("sequelize");

const Stock_opname = (sequelize) => {
  return sequelize.define("Stock_opname", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
};

module.exports = Stock_opname;
