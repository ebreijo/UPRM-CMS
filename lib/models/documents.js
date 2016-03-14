'use strict';

module.exports = function (sequelize, DataTypes) {
  var documents = sequelize.define('documents', {
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
    tableName: 'public_documents',
    timestamps: false
  });
  return documents;
};
