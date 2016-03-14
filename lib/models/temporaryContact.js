'use strict';

module.exports = function (sequelize, DataTypes) {
  var temporaryContacts = sequelize.define('temporaryContacts', {
    //  email (PK) (VARCHAR (255)) (NOT NULL)
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
    //  company_name (VARCHAR (63)) (FK Company) (NOT NULL)
    companyName: {
      type: DataTypes.STRING(63),
      field: 'company_name',
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    //  first_name (VARCHAR (45)) (NOT NULL)
    firstName: {
      type: DataTypes.STRING(45),
      field: 'first_name',
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,45}$/
      }
    },
    //  last_name (VARCHAR (45)) (NOT NULL)
    lastName: {
      type: DataTypes.STRING(45),
      field: 'last_name',
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ][\s]?){2,45}$/
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
      field: 'phone_number',
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\+?([1]{1})?[-]?([0-9]{3})\)?[-]([0-9]{3})[-]([0-9]{4})$/
      }
    }
  }, {
    tableName: 'temporary_contact',
    timestamps: false,
    underscore: true,
    classMethods: {
      associate: function(models) {
        temporaryContacts.belongsTo(models.companies, {foreignKey: 'companyName'});
      }
    }
  });
  return temporaryContacts;
};
