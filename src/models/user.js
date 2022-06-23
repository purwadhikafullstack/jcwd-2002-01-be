const { DataTypes } = require("sequelize");

const User = (sequelize) => {
  return sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    DOB: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};

module.exports = User;
