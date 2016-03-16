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
    jobPosition: {
      type: DataTypes.ENUM('Internship', 'Full-Time', 'Part-Time', 'CO-OP'),
      field: 'job_position',
      allowNull: true,
      validate: {
        notEmpty: false,
        isIn: [['Internship', 'Full-Time', 'Part-Time', 'CO-OP']]
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
