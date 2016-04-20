'use strict';

module.exports = function (sequelize, DataTypes) {
  var promotionalMaterial = sequelize.define('promotionalMaterial', {
    //  flyer_id (PK) (INT UNSIGNED) (NOT NULL)
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      field: 'flyer_id',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    // company_name (VARCHAR (63)) (FK Company) (NOT NULL)
    companyName: {
      type: DataTypes.STRING(63),
      field: 'company_name',
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    } ,
    // title (VARCHAR (63)) (NOT NULL)
    title: {
      type: DataTypes.STRING(63),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    // file_path (VARCHAR (255))(NOT NULL)
    filePath: {
      type: DataTypes.STRING,
      field: 'file_path',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    //  expiration_date (DATETIME) (NOT NULL)
    expirationDate: {
      type: DataTypes.DATE,
      field: 'expiration_date',
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    //  status (ENUM (‘approved’, ‘rejected’, ‘pending’) Default = ‘pending’
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      validate: {
        isAlpha: true,
        isIn: [['pending', 'approved', 'rejected']]
      }
    }
  } , {
    tableName: 'promotional_material',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        promotionalMaterial.belongsTo(models.companies, {foreignKey: 'companyName'});
      }
    },
    instanceMethods: {
      getJSON: function() {
        var values = this.get(); // return all the values of this instance
        delete values.filePath;
        return values;
      }
    }
  });
  return promotionalMaterial;
};

