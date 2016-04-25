'use strict';

module.exports = function (sequelize, DataTypes) {
  var students = sequelize.define('students', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'student',
      validate: {
        notEmpty: true
      }
    },
    studentTicket: {
      type: DataTypes.STRING,
      field: 'student_ticket',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'student',
    timestamps: false
  });
  return students;
};
