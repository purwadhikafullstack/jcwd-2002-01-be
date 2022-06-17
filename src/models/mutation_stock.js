const { DataTypes } = require("sequelize");

const MutationStock = (sequelize) => {
  return sequelize.define("MutationStock", {
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
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};

module.exports = MutationStock;
