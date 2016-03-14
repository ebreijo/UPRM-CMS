'use strict';

module.exports = function (sequelize, DataTypes) {
  var jobFairCompanyLookingFor = sequelize.define('jobFairCompanyLookingFor', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    companyName: {
      type: DataTypes.STRING(63),
      field: 'company_name',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.STRING(40),
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      validate: {
        isAlpha: true,
        isIn: [['false', 'true']]
      }
    }
  }, {
    tableName: 'job_fair_company_looking_for',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        jobFairCompanyLookingFor.belongsTo(models.companies, {foreignKey: 'companyName'});
      }
    }
  });
  return jobFairCompanyLookingFor;
};
