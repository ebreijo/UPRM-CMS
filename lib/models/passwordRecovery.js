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
    //  password_recovery_code (VARCHAR (40))
    passwordRecoveryCode: {
      type: DataTypes.STRING(40),
      field: 'password_recovery_code',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    typeOfUser: {
      type: DataTypes.ENUM('admin', 'recruiter'),
      field: 'type_of_user',
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['admin', 'recruiter']]
      }
    }
  } , {
    tableName: 'password_recovery',
    timestamps: false
  });
  return passwordRecovery;
};
