'use strict';

module.exports = function (sequelize, DataTypes) {
  var jobFairCompanyInformation = sequelize.define('jobFairCompanyInformation', {
    companyName: {
      type: DataTypes.STRING(63),
      field: 'company_name',
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ][\s]?){2,63}/
      }
    },
    minGpa: {
      type: DataTypes.DECIMAL(4,2),
      field: 'min_gpa',
      allowNull: true,
      validate: {
        isFloat: true
      }
    },
    // extra_information VARCHAR(255)
    extraInformation: {
      type: DataTypes.STRING(255),
      field: 'extra_information',
      allowNull: true
    },
    // collecting_resumes_before_job_fair TINYINT(1)
    collectingResumesBeforeJobFair: {
      type: DataTypes.BOOLEAN,
      field: 'collecting_resumes_before_job_fair',
      validate: {
        isAlpha: true,
        isIn: [['false', 'true']]
      }
    },
    // must_fill_online TINYINT(1)
    mustFillOnline: {
      type: DataTypes.BOOLEAN,
      field: 'must_fill_online',
      validate: {
        isAlpha: true,
        isIn: [['false', 'true']]
      }
    },
    // interviews_during_weekend TINYINT(1)
    interviewsDuringWeekend: {
      type: DataTypes.BOOLEAN,
      field: 'interviews_during_weekend',
      validate: {
        isAlpha: true,
        isIn: [['false', 'true']]
      }
    },
    // attending TINYINT(1)
    attending: {
      type: DataTypes.BOOLEAN,
      validate: {
        isAlpha: true,
        isIn: [['false', 'true']]
      }
    },
    // website_application VARCHAR(255)
    websiteApplication: {
      type: DataTypes.STRING(255),
      field: 'website_application',
      allowNull: true
    }
  }, {
    tableName: 'job_fair_company_information',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        jobFairCompanyInformation.belongsTo(models.companies, {foreignKey: 'companyName'});
      }
    }
  });
  return jobFairCompanyInformation;
};
