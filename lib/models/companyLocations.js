'use strict';

module.exports = function (sequelize, DataTypes) {
  var companyLocations = sequelize.define('companyLocations', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true
      }
    },
    companyName: {
      type: DataTypes.STRING(63),
      field: 'company_name',
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    streetAddress: {
      type: DataTypes.STRING,
      field: 'street_address',
      allowNull: true,
      validate: {
        notEmpty: true,
        is: /^([a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ][,.\s\-'#&\(\)]*){5,255}$/
      }
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ][\s]?){2,45}$/
      }
    },
    state: {
      type: DataTypes.STRING(45),
      validate: {
        is: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ][\s]?){2,45}/
      }
    },
    country: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ][\s]?){2,45}/
      }
    },
    zipCode: {
      type: DataTypes.STRING(15),
      field: 'zip_code',
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\d{5}(?:[-]\d{4})?$/
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
      field: 'phone_number',
      validate: {
        is: /^\+?([1]{1})?[-]?([0-9]{3})\)?[-]([0-9]{3})[-]([0-9]{4})$/
      }
    }
  }, {
    tableName: 'company_location',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        companyLocations.belongsTo(models.companies, {foreignKey: 'companyName'});
        companyLocations.hasMany(models.recruiters, {foreignKey: 'companyLocation'});
      }
    }
  });
  return companyLocations;
};
