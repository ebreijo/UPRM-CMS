'use strict';

module.exports = function (sequelize, DataTypes) {
  var pictures = sequelize.define('pictures', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    fileLabel: {
      type: DataTypes.STRING,
      field: 'file_label',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    filePath: {
      type: DataTypes.STRING,
      field: 'file_path',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'home_page_photos',
    timestamps: false
  });
  return pictures;
};
