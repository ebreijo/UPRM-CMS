'use strict';

module.exports = function (sequelize, DataTypes) {
  var companies = sequelize.define('companies', {
    name: {
      type: DataTypes.STRING(63),
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[-a-z0-9 ,.'`$?&@!/^%-()ñÑáéíóúÁÉÍÓÚ]{2,63}(\.)?$/i
      }
    },
    websiteUrl: {
      type: DataTypes.STRING,
      field: 'website_url',
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    logoPath: {
      type: DataTypes.STRING,
      field: 'logo_path',
      allowNull: true
    },
    companyDescription: {
      type: DataTypes.STRING(511),
      field: 'company_description',
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 511]
      }
    },
    companyStatus: {
      type: DataTypes.ENUM('pending', 'active', 'inactive'),
      field: 'company_status',
      defaultValue: 'pending',
      validate: {
        isAlpha: true,
        isIn: [['pending', 'active', 'inactive']]
      }
    },
    registrationDate: {
      type: DataTypes.DATE,
      field: 'registration_date'
    }
  }, {
    tableName: 'company',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        companies.hasMany(models.recruiters, {foreignKey: 'companyName'});
        companies.hasMany(models.jobOffers, {foreignKey: 'companyName'});
        companies.hasMany(models.companyLocations, {foreignKey: 'companyName'});
      }
    }
  });
  return companies;
};
