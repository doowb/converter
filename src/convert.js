/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var stream = require('stream');
var plist = require('plist');
var YAML = require('yamljs');
var util = require('util');
var _ = require('lodash');
var csv = require('csv');
var xml2js = require('xml2js');

var extend = function(options) {

	var opts = _.extend({
		from: 'csv',
		to: 'json',
		pretty: true,
		mergeAttrs: true,
		inline: 8,
		indent: 2,
		csv: {
			columns: true,
			delimiter: ','
		},
		xml: {
			renderOpts: {
        pretty: true
      },
      xmldec: {
        'version': '1.0',
        'encoding': 'UTF-8',
        'standalone': true
      }
		}
	}, options);

	return opts;
};

var convertCsvToJson = function (data, options, done) {
	csv()
		.from(data, options.csv)
		.to.array(function(row) {
			var results = JSON.stringify(row, null, options.indent);
			done(null, results);
		});
};

var convertJsonToCsv = function(data, options, done) {
	var results = '';
	data = JSON.parse(data);
	csv()
		.from(data)
		.to.string(function(results, count) {
			done(null, results);
		});
};

var convertXmlToJson = function(data, options, done) {
	var parser = new xml2js.Parser(options);
	parser.parseString(data, function (err, result) {
    var results = JSON.stringify(result, null, options.indent);
    done(null, results);
  });
};

var convertYmlToJson = function(data, options, done) {
	var results = JSON.stringify(YAML.parse(data), null, options.indent);
	done(null, results);
};

var convertPlistToJson = function(data, options, done) {
	var results = JSON.stringify(plist.parseFileSync(data), null, options.indent);
	done(null, results);
};

var convertJsonToXml = function(data, options, done) {
	var xamlOpts = options.xml || {};
	var opts = {
    renderOpts: xamlOpts.renderOpts,
    xmldec: xamlOpts.xmldec
  };
	var builder = new xml2js.Builder(opts);
	var xml = builder.buildObject(JSON.parse(data));
	done(null, xml);
};

var convertJsonToYml = function(data, options, done) {
	var results = YAML.stringify(JSON.parse(data), options.inline, options.indent);
	done(null, results);
};

var convertJsonToPlist = function(data, options, done) {
	var results = plist.build(JSON.parse(data)).toString();
	done(null, results);
};

var convertJsonToJson = function(data, options, done) {
	// this is just dumb :)
	var results = JSON.stringify(JSON.parse(data), null, options.indent);
	done(null, results);
};


var convertXmlToYml = function(data, options, done) {
	convertXmlToJson(data, options, function(err, results) {
		convertJsonToYml(results, options, done);
	});
};

var convertXmlToPlist = function(data, options, done) {
	convertXmlToJson(data, options, function(err, results) {
		convertJsonToPlist(results, options, done);
	});
};

var convertXmlToXml = function(data, options, done) {
	convertXmlToJson(data, options, function(err, results) {
		convertJsonToXml(results, options, done);
	});
};



var convertYmlToCsv = function(data, options, done) {
	convertYmlToJson(data, options, function(err, results) {
		convertJsonToCsv(results, options, done);
	});
};

var convertYmlToXml = function(data, options, done) {
	convertYmlToJson(data, options, function(err, results) {
		convertJsonToXml(results, options, done);
	});
};

var convertYmlToYml = function(data, options, done) {
	convertYmlToJson(data, options, function(err, results) {
		convertJsonToYml(results, options, done);
	});
};

var convertYmlToPlist = function(data, options, done) {
	convertYmlToJson(data, options, function(err, results) {
		convertJsonToPlist(results, options, done);
	});
};



var convertPlistToCsv = function(data, options, done) {
	convertPlistToJson(data, options, function(err, results) {
		convertJsonToCsv(results, options, done);
	});
};

var convertPlistToXml = function(data, options, done) {
	convertPlistToJson(data, options, function(err, results) {
		convertJsonToXml(results, options, done);
	});
};

var convertPlistToYml = function(data, options, done) {
	convertPlistToJson(data, options, function(err, results) {
		convertJsonToYml(results, options, done);
	});
};

var convertPlistToPlist = function(data, options, done) {
	convertPlistToJson(data, options, function(err, results) {
		convertJsonToPlist(results, options, done);
	});
};


var map = {

	'csv': {
		'json': convertCsvToJson
	},

	'xml': {
		'json': convertXmlToJson,
		'yml': convertXmlToYml
	},

	'yml': {
		'json': convertYmlToJson,
		'csv': convertYmlToCsv,
		'xml': convertYmlToXml,
		'yml': convertYmlToYml,
		'plist': convertYmlToPlist
	},

	'plist': {
		'json': convertPlistToJson,
		'csv': convertPlistToCsv,
		'xml': convertPlistToXml,
		'yml': convertPlistToYml,
		'plist': convertPlistToPlist
	},

	'json': {
		'csv': convertJsonToCsv,
		'xml': convertJsonToXml,
		'yml': convertJsonToYml,
		'plist': convertJsonToPlist
	}

};

var Converter = function(options) {
	var self = this;
	self.opts = extend(options);
	self.from = self.opts.from.toLowerCase();
	self.to = self.opts.to.toLowerCase();
	self.buffer = '';

	self.stream = new stream.Transform();
	self.stream._transform = function(data, encoding, done) {
		self.buffer += data;
		done();
	};

	self.stream._flush = function(done) {
		map[self.from][self.to](self.buffer, self.opts, function(err, data) {
			if(err) {
				console.log('Error: ', err);
				return done();
			}
			self.stream.push(data);
			done();
		});
	};
};

var convert = module.exports = function(options) {
	return new Converter(options).stream;
};
