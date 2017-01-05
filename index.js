'use strict';

var extend = require('extend-shallow');
var utils = require('./lib/utils');

/**
 * ```js
 * var Converter = require('converter');
 * var converter = new Converter();
 * ```
 * @param {Object} `options` Default options to use.
 * @api public
 */

function Converter(options) {
  this.options = options || {};
}

/**
 * Register `ext` with optional `deps` and the given converter `fn`.
 *
 * @param {String} `ext`
 * @param {String|Array} `deps` One or more converters to run before invoking `fn`
 * @param {Function} `fn`
 * @return {Object} Returns the instance for chaining
 * @api public
 */

Converter.prototype.register = function(ext, deps, fn) {
  this[utils.formatDot(ext)] = utils.reduce(this, deps, fn);
  return this;
};

/**
 * Export `Converter`
 */

module.exports = Converter;
