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
var src = require('path').join.bind('.', 'test', 'fixtures');
var dest = require('path').join.bind('.', 'test', 'actual');
var fs = require('fs');

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

var createFileStreams = function(filename, options) {
  var reader = fs.createReadStream(src(filename + '.' + options.from));
  var writer = fs.createWriteStream(dest(filename + '.' + options.to));
  return {
    reader: reader,
    writer: writer
  };
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


  it('should convert csv to json', function(done) {
    var options = {
      from: 'csv',
      to: 'json'
    };
    var files = createFileStreams('csv2json', options);
    files.reader
      .pipe(convert(options))
      .pipe(files.writer);
    done();
  });

  it('should convert json to xml', function(done) {
    var options = {
      from: 'json',
      to: 'xml'
    };
    var files = createFileStreams('sublime', options);
    files.reader
      .pipe(convert(options))
      .pipe(files.writer);
    done();
  });

  it('should convert json to csv', function(done) {
    var options = {
      from: 'json',
      to: 'csv'
    };
    var files = createFileStreams('json2csv', options);
    files.reader
      .pipe(convert(options))
      .pipe(files.writer);
    done();
  });

  it('should convert json to yml', function(done) {
    var options = {
      from: 'json',
      to: 'yml'
    };
    var files = createFileStreams('json2yml', options);
    files.reader
      .pipe(convert(options))
      .pipe(files.writer);
    done();
  });

  it('should convert xml to json - simple', function(done) {
    var options = {
      from: 'xml',
      to: 'json'
    };
    var files = createFileStreams('simple', options);
    files.reader
      .pipe(convert(options))
      .pipe(files.writer);
    done();
  });

  it('should convert xml to yml - advanced', function(done) {
    var options = {
      from: 'xml',
      to: 'yml'
    };
    var files = createFileStreams('theme', options);
    files.reader
      .pipe(convert(options))
      .pipe(files.writer);
    done();
  });
  
  it('should convert yml to json', function(done) {
    var options = {
      from: 'yml',
      to: 'json'
    };
    var files = createFileStreams('yml2json', options);
    files.reader
      .pipe(convert(options))
      .pipe(files.writer);
    done();
  });

});