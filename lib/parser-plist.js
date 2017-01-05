'use strict';

/**
 * Requires cache
 */

var requires = {};

/**
 * Expose `parser`
 */

var parser = module.exports;

/**
 * Options
 */

parser.options = {
  src: {ext: 'plist'},
  dest: {ext: 'xml'},
  from: 'plist',
  to: 'xml'
};

/**
 * Parse the given `data` with the specified options and callback.
 *
 * @param {String|Object} `data` The object or string to parse.
 * @param {Object} `options`
 * @param {Function} `callback`
 * @api public
 */

parser.parse = function(xml, options, cb) {
  var plist = requires.plist || (requires.plist = require('plist'));
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }
  try {
    cb(null, plist.parse(xml));
  } catch (err) {
    return cb(err);
  }
};

/**
 * Parse the given `xml`
 *
 * @param {String|Object} `xml` The object or string to parse.
 * @param {Object} `options` to pass to `foo`
 * @api public
 */

parser.parseSync = function(xml) {
  var plist = requires.plist || (requires.plist = require('plist'));
  try {
    return plist.parse(xml);
  } catch (err) {
    return err;
  }
};
