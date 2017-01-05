'use strict';

// require('time-require');
var Time = require('time-diff');
var time = new Time();
time.start('requires');

var fs = require('fs');
var Converter = require('./');
var converter = new Converter();

converter.register('csv', require('./lib/parser-csv').parseSync);
converter.register('yaml', require('./lib/parser-yamljs').parseSync);
converter.register('plist', require('./lib/parser-plist').parseSync);
converter.register('xml', require('./lib/parser-xml').parseSync);

converter.register('read', function(fp) {
  return fs.readFileSync(fp, 'utf8');
});

converter.register('json', function(str) {
  return JSON.parse(str);
});

converter.register('toJSON', function(fp) {
  return converter.json(converter.read(fp));
});

converter.register('toYAML', function(fp) {
  return converter.yaml(converter.read(fp));
});

converter.register('convert', function(fp) {
  return converter.toYAML(fp);
});

converter.register('stringify', function(fp) {
  return JSON.stringify(converter.convert(fp), null, 2);
});

var res = converter.stringify('test/fixtures/foo.yml');
console.log(res);
console.log(time.end('requires'));
var res = converter.stringify('test/fixtures/foo.yml');
console.log(res);
console.log(time.end('requires'));
var res = converter.stringify('test/fixtures/foo.yml');
console.log(res);
console.log(time.end('requires'));
var res = converter.stringify('test/fixtures/foo.yml');
console.log(res);
console.log(time.end('requires'));

