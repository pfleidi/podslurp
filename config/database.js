// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'podslurp',
      user:     'podslurp',
      password: 'password'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'podslurp',
      user:     'podslurp',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'podslurp',
      user:     'podslurp',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
