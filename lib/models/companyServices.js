'use strict';

module.exports = function (sequelize, DataTypes) {
  var companyServices = sequelize.define('companyServices', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'company_services',
    timestamps: false
  });
  return companyServices;
};
