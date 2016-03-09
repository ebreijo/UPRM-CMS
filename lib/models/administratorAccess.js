'use strict';

module.exports = function (sequelize, DataTypes) {
  var administratorAccess = sequelize.define('administratorAccess', {
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
    isRoot: {
      type: DataTypes.BOOLEAN,
      field: 'is_root',
      validate: {
        isAlpha: true,
        isIn: [['false', 'true']]
      }
    },
    adminAccountStatus: {
      type: DataTypes.ENUM('pending', 'active', 'inactive'),
      field: 'admin_account_status',
      validate: {
        isAlpha: true,
        isIn: [['pending', 'active', 'inactive']]
      }
    }
  }, {
    tableName: 'administrator_access',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        administratorAccess.hasOne(models.administrators, {foreignKey: 'email'});
      }
    }
  });
  return administratorAccess;
};
