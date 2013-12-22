### foo
Type: `String`
Default value: `undefeined`

A string value that is used to do something with whatever.

### bar
Type: `Array`
Default value: `[]`

A string value that is used to do something else with whatever else.



## Usage Examples

### Example foo
Transform a string with an object of replacement patterns

```js
frep.strWithObj(String, Object)
```

Parameters:

* `String`: The string to modify with the given replacement patterns.
* `Object`: Object of replacement patterns, where each key is a string or a RegExp `pattern`, and each value is the `replacement` string or function to be called for each match.
* A new string is returned with some or all matches replaced by the given replacement patterns.


Given the following:

```js
var frep = require('frep');

var str = 'ABC'
var replacements = {
  'A': 'AAA',
  'B': 'BBB',
  'C': 'CCC',
  'D': 'DDD',
  'E': 'EEE',
  'F': 'FFF'
};

frep.strWithObj(str, replacements));
// => AAABBBCCC
```
