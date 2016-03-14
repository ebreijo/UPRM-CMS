'use strict';

module.exports = function (sequelize, DataTypes) {
  var companyInterestedMajors = sequelize.define('companyInterestedMajors', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    companyName: {
      type: DataTypes.STRING(63),
      field: 'company_name',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    majorCode: {
      type: DataTypes.STRING(4),
      field: 'major_code',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'company_interested_majors',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        companyInterestedMajors.belongsTo(models.companies, {foreignKey: 'companyName'});
        companyInterestedMajors.belongsTo(models.majors, {foreignKey: 'majorCode'});
      }
    }
  });
  return companyInterestedMajors;
};
