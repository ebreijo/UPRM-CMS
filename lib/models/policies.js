'use strict';

module.exports = function (sequelize, DataTypes) {
  var policies = sequelize.define('policies', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    policy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'policies',
    timestamps: false
  });
  return policies;
};
