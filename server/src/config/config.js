require('dotenv').config();

const useSqliteInTest = process.env.USE_SQLITE_TEST === '1';

const common = {
  logging: false,
  define: {
    underscored: true
  }
};

module.exports = {
  development: {
    ...common,
    dialect: 'postgres',
    url: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'soundreviews_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  test: useSqliteInTest ? {
    ...common,
    dialect: 'sqlite',
    storage: ':memory:'
  } : {
    ...common,
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'soundreviews_test',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  production: {
    ...common,
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};
