'use strict';

var mm = require('micromatch');

var arr = ['foo', function bar() {}, 'baz', 'qux'];
var obj = {
  'foo': {},
  'bar': {}
}

var res = mm.matchKeys(obj, arr);

console.log(res);
