'use strict';

module.exports = function (sequelize, DataTypes) {
  var majors = sequelize.define('majors', {
    majorCode: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      unique: true,
      allowNull: false,
      field: 'major_code',
      validate: {
        notEmpty: true,
        isAlpha: true
      }
    },
    nameEnglish: {
      type: DataTypes.STRING(63),
      field: 'name_english',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    nameSpanish: {
      type: DataTypes.STRING(63),
      field: 'name_spanish',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'major',
    timestamps: false
  });
  return majors;
};
