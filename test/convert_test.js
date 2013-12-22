/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var stream = require('stream');
var convert = require('../');

var createReader = function(lines) {
  var reader = new stream.Readable();
  reader._read = function() {
    lines.map(function(line) {
      reader.push(line);
    });
    reader.push(null);
  };

  return reader;
};

var createWriter = function(finish) {
  var buffer = '';
  var writer = new stream.Writable();
  writer._write = function(chunk, enc, next) {
    buffer += chunk;
    next();
  };

  writer.toString = function() {
    return buffer;
  };

  writer.on('finish', finish);
  return writer;
};

describe('convert', function() {

  it('should create new stream', function(done) {
    var expected = '[\n  [\n    \"beep\"\n  ]\n]';
    var reader = createReader(['beep']);
    var writer = createWriter(function() {
        expect(writer.toString()).to.eql(expected);
        done();
      });

    reader.pipe(convert()).pipe(writer);
  });

});