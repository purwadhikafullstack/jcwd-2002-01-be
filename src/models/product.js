const { DataTypes } = require("sequelize");

const Product = (sequelize) => {
  return sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    no_bpom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    no_medicine: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    packaging: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};

module.exports = Product;
