module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD ,
    database: process.env.POSTGRES_DB ,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  test: {
    username: process.env.TEST_DB_USERNAME || 'test_user',
    password: process.env.TEST_DB_PASSWORD || null,
    database: process.env.TEST_DB_NAME || 'test_db',
    host: process.env.TEST_DB_HOST || '127.0.0.1',
    dialect: 'sqlite', 
    storage: ':memory:',
  },
};
