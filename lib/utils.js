'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('extend-shallow', 'extend');
require('parse-csv', 'csv');
require('plist');
require('xml2js', 'xml');
require('js-yaml', 'yaml');
require = fn;

utils.reduce = function(cache, deps, fn) {
  if (typeof deps === 'function') {
    fn = deps;
    deps = [];
  }

  deps = Array.isArray(deps) ? deps : [deps];
  if (typeof fn === 'undefined') {
    fn = deps.pop();
  }
  if (typeof fn === 'string') {
    fn = cache[fn];
  }

  var len = deps.length;
  var idx = -1;

  return function(val) {
    while (++idx < len) {
      var conv = deps[idx];

      if (typeof conv !== 'function') {
        conv = deps[idx] = cache[utils.formatDot(conv)];
      }

      var res = conv.call(cache, val);
      if (typeof res !== 'undefined') {
        val = res;
      }
    }
    return fn.call(cache, val);
  };
};

utils.formatDot = function(ext) {
  return (ext && ext.charAt(0) === '.') ? ext.slice(1) : ext;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
