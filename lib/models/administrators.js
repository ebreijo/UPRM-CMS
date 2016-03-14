'use strict';

var bcrypt = require('bcrypt');
var Promise = require('bluebird');
var hash = Promise.promisify(bcrypt.hash, bcrypt);
var comparePassword = Promise.promisify(bcrypt.compare, bcrypt);
var SALT_WORK_FACTOR = 8;

module.exports = function (sequelize, DataTypes) {
  var administrators = sequelize.define('administrators', {
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
    firstName: {
      type: DataTypes.STRING(45),
      field: 'first_name',
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,45}$/
      }
    },
    lastName: {
      type: DataTypes.STRING(45),
      field: 'last_name',
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ][\s]?){2,45}$/
      }
    }
  }, {
    tableName: 'administrator',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        administrators.belongsTo(models.administratorAccess, {foreignKey: 'email'});
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
  return administrators;
};
