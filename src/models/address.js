const { DataTypes } = require("sequelize");

const Address = (sequelize) => {
  return sequelize.define("Address", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    recipient_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipient_telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_main_address: {
      type: DataTypes.BOOLEAN,
    },
  });
};

module.exports = Address;
