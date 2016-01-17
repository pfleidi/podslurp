'use strict';

const checkit = require('checkit');
const _ = require('lodash');

require('./file')

const schema = {
  id: ['required', 'uuid'],

  transfer_state: 'required',
  transferred_bytes: ['required', 'integer'],
  transfer_time: ['required', 'integer'],
  response_code: ['required', 'integer'],
  parsed_user_agent: 'required',
  raw_user_agent: 'required',
  country: 'required',
  ip_address: 'required',
  parsed_referrer: 'required',
  raw_referrer: 'required',

  created_at: ['required', 'date'],
  updated_at: ['required', 'date']
};

module.exports = function download(bookshelf) {

  var Download = bookshelf.Model.extend({
    tableName: 'downloads',

    initialize: function (attrs, opts) {
      this.on('saving', this.validateSave);
    },

    scopes: {
      complete: function (qb) {
        qb.where({ transfer_state: 'completed' });
      },

      incomplete: function (qb) {
        qb.where({ transfer_state: 'partial' });
      },

      canceled: function (qb) {
        qb.where({ transfer_state: 'canceled' });
      }
    },

    validateSave: function () {
      return new checkit(schema).run(this.attributes);
    },

    file: function () {
      return this.belongsTo('File');
    }
  }, {
    /* class methods */

    metaData: function (qb) {
      return this.query(function (qb) {
        qb
        .sum('transferred_bytes as sentBytes')
        .count('* as count');
      });
    },

    files: function (qb) {
      return this.query(function (qb) {
        qb
        .select('file_name as fileName')
        .count('* as count')
        .sum('transferred_bytes as sentBytes')
        .groupBy('file_name');
      });
    }
  });

  return bookshelf.model('Download', Download);
};
