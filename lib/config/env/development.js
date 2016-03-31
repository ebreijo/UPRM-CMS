'use strict';

module.exports = {
  env: 'development',
  db: {
    user: 'root',
    password: null,
    database: 'uprm_cms_development',
    sequelize: {
      port: '3306',
      host:'localhost',
      dialect: 'mariadb',
      quoteIdentifiers: false,
      pool: {
        max: 20,
        min: 5,
        idle: 10000
      }
    }
  }
};
