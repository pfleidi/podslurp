
exports.up = function (knex, Promise) {
  return knex.schema.table('downloads', function (table) {
    table.dropIndex('file_name');
    table.dropColumn('file_name');

    table.dropColumn('mime_type');

    /* create reation to files table */
    table.uuid('file_id').notNullable().references('id').inTable('files');
    table.index('file_id');
  });
};

exports.down = function (knex, Promise) {
  return knex.raw('ALTER TABLE downloads DROP FOREIGN KEY downloads_file_id_foreign')
  .then(function () {
    return knex.schema.table('downloads', function (table) {
      table.dropColumn('file_id')

      table.string('file_name').notNullable();
      table.string('mime_type').notNullable();

      table.index('file_name');
    });
  });
};
