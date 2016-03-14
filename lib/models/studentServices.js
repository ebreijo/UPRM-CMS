'use strict';

module.exports = function (sequelize, DataTypes) {
  var studentServices = sequelize.define('studentServices', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'student_services',
    timestamps: false
  });
  return studentServices;
};

