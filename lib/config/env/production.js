'use strict';

var env = process.env;
module.exports = {
  env: 'production',
  db: {
    user: env.UPRM_CMS_DB_USER,
    password: env.UPRM_CMS_DB_PASSWORD,
    database: env.UPRM_CMS_DB,
    sequelize: {
      port: env.UPRM_CMS_DB_PORT,
      host: env.UPRM_CMS_DB_HOST,
      dialect: 'mariadb',
      quoteIdentifiers: false,
      logging: function() {}
    }
  }
};
