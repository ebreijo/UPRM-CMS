'use strict';

module.exports = function (sequelize, DataTypes) {
  var aboutUs = sequelize.define('aboutUs', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    vision: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    missionDesc: {
      type: DataTypes.STRING,
      field: 'mission_desc',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    policiesDesc: {
      type: DataTypes.STRING,
      field: 'policies_desc',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    requirementsDesc: {
      type: DataTypes.STRING,
      field: 'requirements_desc',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'about_us',
    timestamps: false
  });
  return aboutUs;
};
