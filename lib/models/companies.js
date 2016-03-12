'use strict';

module.exports = function (sequelize, DataTypes) {
  var companies = sequelize.define('companies', {
    name: {
      type: DataTypes.STRING(63),
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    websiteUrl: {
      type: DataTypes.STRING,
      field: 'website_url',
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
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
        notEmpty: true
      }
    },
    companyStatus: {
      type: DataTypes.ENUM('pending', 'active', 'inactive'),
      field: 'company_status',
      allowNull: false,
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
      }
    }
  });
  return companies;
};
