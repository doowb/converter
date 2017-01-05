'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var utils = require('./utils');

/**
 * Requires cache
 */

var requires = {};

/**
 * Expose `parser`
 */

var parser = module.exports;

/**
 * Parse the given `str` of YAML and callback `cb(err, obj)`.
 *
 * @name .parse
 * @param {String|Object} `str` The object or string to parse.
 * @param {Object|Function} `options` or `cb` callback function.
 * @param {Function} `cb` callback function.
 * @api public
 */

parser.parse = function(str, options, cb) {
  var yaml = requires.yaml || (requires.yaml = utils.yaml);
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opts = utils.extend({}, options);
  try {
    cb(null, yaml.safeLoad(stripBOM(str), opts));
  } catch (err) {
    cb(err);
    return;
  }
};

/**
 * Parse the given `str` of YAML.
 *
 * @param {String|Object} `str` The object or string to parse.
 * @return {Object}
 * @api public
 */

parser.parseSync = function(str, options) {
  var yaml = requires.yaml || (requires.yaml = utils.yaml);
  var opts = utils.extend({}, options);
  try {
    return yaml.safeLoad(stripBOM(str), opts);
  } catch (err) {
    return err;
  }
};

/**
 * YAML file support. Parse a file at the given `filepath` and
 * callback `callback(err, obj)`.
 *
 * ```js
 * parser.parseFile('foo/bar/baz.yml');
 * ```
 *
 * @param {String} `filepath`
 * @param {Object|Function} `options` or callback function.
 * @param {Function} `callback`
 * @api public
 */

parser.parseFile = function(fp, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opts = utils.extend({}, options);
  try {
    fs.readFile(fp, 'utf8', function(err, str) {
      parser.parse(str, opts, cb);
    });
  } catch (err) {
    cb(err);
    return;
  }
};

/**
 * YAML file support. Parse a file at the given `filepath`.
 *
 * ```js
 * parser.parseFile('foo/bar/baz.yml');
 * ```
 *
 * @param {String} `filepath`
 * @param {Object} `options` Options to pass to [js-yaml]
 * @api public
 */

parser.parseFileSync = function(filepath, options) {
  try {
    var str = fs.readFileSync(filepath, 'utf8');
    return parser.parseSync(str, options);
  } catch (err) {
    return err;
  }
};

/**
 * Strip byte-order marks
 */

function stripBOM(str) {
  if (str[0] === '\uFEFF') {
    return str.slice(1);
  } else {
    return str;
  }
}
