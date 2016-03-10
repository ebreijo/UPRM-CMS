'use strict';

module.exports = function (sequelize, DataTypes) {
  var ourStaff = sequelize.define('ourStaff', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'our_staff',
    timestamps: false
  });
  return ourStaff;
};

