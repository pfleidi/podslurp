var table = function (table) {
  table.increments().primary();
  table.string('file_name').notNullable();

  table.enum('transfer_state', ['completed', 'partial', 'canceled']).notNullable();
  table.integer('transferred_bytes').defaultTo(0).notNullable();
  table.integer('transfer_time').notNullable();
  table.integer('response_code').notNullable();
  table.string('parsed_user_agent').notNullable();
  table.string('raw_user_agent').notNullable();
  table.string('country').notNullable();
  table.string('ip_address').notNullable();
  table.string('parsed_referrer').notNullable();
  table.string('raw_referrer').notNullable();
  table.string('mime_type').notNullable();
  table.timestamps();

  // defined by timestamps();
  table.index('created_at');
  table.index('file_name');
  table.index('transfer_state');
};

exports.up = function (knex, Promise) {
  return knex.schema.createTable('downloads', table)
  .then(function () {
    console.log('Downloads table is created!');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema
  .dropTable('downloads', table)
  .then(function () {
    console.log('Downloads table was dropped!');
  });
};
