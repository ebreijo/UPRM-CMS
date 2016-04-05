'use strict';

module.exports = function (sequelize, DataTypes) {
  var jobFairDates = sequelize.define('jobFairDates', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    headerEnglish: {
      type: DataTypes.STRING(63),
      allowNull: false,
      field: 'header_en',
      validate: {
        notEmpty: true
      }
    },
    locationEnglish: {
      type: DataTypes.STRING(63),
      allowNull: false,
      field: 'location_en',
      validate: {
        notEmpty: true
      }
    },
    dateEnglish: {
      type: DataTypes.STRING(63),
      allowNull: false,
      field: 'date_en',
      validate: {
        notEmpty: true
      }
    },
    time: {
      type: DataTypes.STRING(63),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    headerSpanish: {
      type: DataTypes.STRING(63),
      allowNull: false,
      field: 'header_es',
      validate: {
        notEmpty: true
      }
    },
    locationSpanish: {
      type: DataTypes.STRING(63),
      allowNull: false,
      field: 'location_es',
      validate: {
        notEmpty: true
      }
    },
    dateSpanish: {
      type: DataTypes.STRING(63),
      allowNull: false,
      field: 'date_es',
      validate: {
        notEmpty: true
      }
    },
    resumeDeadlineDate: {
      type: DataTypes.DATEONLY,
      field: 'resume_deadline_date',
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    showResumeDeadlineDate: {
      type: DataTypes.BOOLEAN,
      field: 'show_resume_deadline_date',
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['false', 'true']]
      }
    }
  }, {
    tableName: 'job_fair_dates',
    timestamps: false
  });
  return jobFairDates;
};
