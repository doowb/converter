To install the module, run the following in the command line:

```bash
npm i {%= name %} --save
```

Use within your application with the following line of JavaScript:

```js
var {%= safename %} = require('{%= name %}');
```

Calling `var convert = {%= safename %}(options);` gives you a `transform` stream that will take in data and convert it based on the options passed in.

```js

var fs = require('fs');
var {%= safename %} = require('{%= name %}');

// get a file stream reader pointing to the csv file to convert
var reader = fs.createReadStream('path/to/csv/file.csv');

// get a file stream writer pointing to the json file to write to
var writer = fs.createWriteStream('path/to/output/json/file.json');

// setup the options for the data converter
var options = {
	from: 'csv',
	to: 'json'
};

// get a data converter stream using the given options
var convert = {%= safename %}(options);

// pipe everything to do the conversion
reader.pipe(convert).pipe(writer);

```