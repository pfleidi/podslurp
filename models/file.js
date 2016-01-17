'use strict';

require('./download')

const checkit = require('checkit');
const _ = require('lodash');

const schema = {
  id: ['required', 'uuid'],

  size: ['required', 'integer'],
  path: 'required',
  mime_type: 'required',

  created_at: ['required', 'date'],
  updated_at: ['required', 'date']
};

module.exports = function file(bookshelf) {

  var File = bookshelf.Model.extend({
    tableName: 'files',

    initialize: function (attrs, opts) {
      this.on('saving', this.validateSave);
    },

    validateSave: function (model, attrs, options) {
      return new checkit(schema).run(attrs);
    },

    downloads: function () {
      return this.hasMany('Download');
    }
  });

  return bookshelf.model('File', File);
};

