'use strict';

module.exports = function (sequelize, DataTypes) {
  var requirements = sequelize.define('requirements', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    requirement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'requirements',
    timestamps: false
  });
  return requirements;
};
