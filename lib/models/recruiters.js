'use strict';

var bcrypt = require('bcrypt');
var Promise = require('bluebird');
var hash = Promise.promisify(bcrypt.hash, bcrypt);
var comparePassword = Promise.promisify(bcrypt.compare, bcrypt);
var SALT_WORK_FACTOR = 8;

module.exports = function (sequelize, DataTypes) {
  var recruiters = sequelize.define('recruiters', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING(63),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    companyName: {
      type: DataTypes.STRING(63),
      field: 'company_name'
    },
    firstName: {
      type: DataTypes.STRING(45),
      field: 'first_name',
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: true
      }
    },
    lastName: {
      type: DataTypes.STRING(45),
      field: 'last_name',
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
      field: 'phone_number',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    accountStatus: {
      type: DataTypes.ENUM('pending', 'active', 'inactive'),
      field: 'account_status',
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
    tableName: 'recruiter',
    timestamps: false,
    underscore: true,
    classMethods: {
      associate: function(models) {
        recruiters.belongsTo(models.companies, {foreignKey: 'companyName'});
      },
      hashPassword: function(password) {
        return hash(password, SALT_WORK_FACTOR);
      }
    },
    instanceMethods: {
      verifyPassword: function(password) {
        return comparePassword(password, this.password);
      },
      getJSON: function() {
        var values = this.get(); // return all the values of this instance
        delete values.password;
        return values;
      }
    }
  });
  return recruiters;
};
