'use strict';

module.exports = function (sequelize, DataTypes) {
  var ourStaff = sequelize.define('ourStaff', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(63),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^([a-zA-ZñÑáéíóúÁÉÍÓÚ.][\s]?){2,63}$/
      }
    },
    position: {
      type: DataTypes.STRING(63),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 63]
      }
    }
  }, {
    tableName: 'our_staff',
    timestamps: false
  });
  return ourStaff;
};

