'use strict';

module.exports = {
  env: 'test',
  db: {
    user: 'root',
    password: null,
    database: 'uprm_cms_test',
    sequelize: {
      port: '3306',
      host:'localhost',
      dialect: 'mariadb',
      quoteIdentifiers: false,
      logging: function() {}
    }
  }
};
