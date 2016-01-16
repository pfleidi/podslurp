'use strict';

const checkit = require('checkit');
const _ = require('lodash');

const schema = {
  id: ['required', 'uuid'],
  file_name: 'required',
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
  mime_type: 'required'
};

module.exports = function download(bookshelf) {

  function extractAttributes(values) {
    return _.merge(values, {
      parsed_referrer: '?',
      parsed_user_agent: '?',
      country: '?',
      mime_type: '?'
    });
  }

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
    }
  }, {
    /* class methods */

    create: function (values) {
      var attributes = extractAttributes(values);

      this.forge(attributes).save()
      .then(function () {
        console.log('Entry successfully saved!');
      })
      .catch(function (error) {
        console.error('Error saving entry: ' + error);
      });
    },

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

  return Download;
};
