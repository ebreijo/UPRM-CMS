'use strict';

module.exports = function (sequelize, DataTypes) {
  var passwordRecovery = sequelize.define('passwordRecovery', {
    //  email (PK) (VARCHAR (255)) (NOT NULL)
    email: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    //  password_recovery_code (VARCHAR (44))
    fileLabel: {
      type: DataTypes.STRING(44),
      field: 'password_recovery_code',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  } , {
    tableName: 'password_recovery',
    timestamps: false
  });
  return passwordRecovery;
};
