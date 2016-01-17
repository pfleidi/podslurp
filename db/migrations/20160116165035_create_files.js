var table = function (table) {
  table.uuid('id').primary();
  table.string('path').unique().notNullable();

  table.bigInteger('size').defaultTo(0).notNullable();
  table.string('mime_type').notNullable();

  table.timestamps();
};

exports.up = function (knex, Promise) {
  return knex.schema.createTable('files', table)
  .then(function () {
    console.log('Files table is created!');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema
  .dropTable('files', table)
  .then(function () {
    console.log('Files table was dropped!');
  });
};
