'use strict';

const checkit = require('checkit');
const _ = require('lodash');

const schema = {
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

    hasTimestamps: ['created_at', 'updated_at'],

    initialize: function (attrs, opts) {
      this.on('saving', this.validateSave);
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
    }
  });

  return Download;
};
