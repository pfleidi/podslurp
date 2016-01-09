// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'podslurp_develop',
      user:     'podslurp',
      password: 'password'
    }
  },

  test: {
    client: 'mysql',
    connection: {
      database: 'podslurp_test',
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
    client: 'mysql',
    connection: {
      database: 'podslurp_prod',
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

  travisci: {
    client: 'mysql',
    connection: {
      database: 'podslurp_travis_test',
      user:     'root'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

};
