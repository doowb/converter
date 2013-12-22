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
		}
	}, options);

	return opts;
};

var toXml = function xml(json, options) {
	var XML_CHARACTER_MAP = {
		'&': '&amp;',
		'"': '&quot;',
		"'": '&apos;',
		'<': '&lt;',
		'>': '&gt;'
	};
	var result = options.header ? '<?xml version="1.0" encoding="UTF-8"?>' : '';
	var type = json.constructor.name;

	options.header = false;

	if(type === 'Array') {
		json.forEach(function(node) {
			result += xml(node, options);
		});
	} else if (type === 'Object' && typeof json === 'object') {

		Object.keys(json).forEach(function(key) {
			if (key !== options.attrkey) {
				var node = json[key];
				var attributes = '';

				if (options.attrkey && json[options.attrkey]) {
					Object.keys(json[options.attrkey]).forEach(function(k) {
						attributes += util.format(' %s="%s"', k, json[options.attrkey][k]);
					});
				}
				var inner = xml(node, options);

				if (inner) {
					result += util.format("<%s%s>%s</%s>", key, attributes, xml(node, options), key);
				} else {
					result += util.format("<%s%s/>", key, attributes);
				}
			}
		});

	} else {
		return json.toString()
			.replace(/([&"<>''])/g, function(str, item) {
				return XML_CHARACTER_MAP[item];
			});
	}

	return result;
};

var convertCsvToJson = function (data, options, done) {
	csv()
		.from(data, options.csv)
		.to.array(function(row) {
			console.log(row);
			var results = JSON.stringify(row, null, options.indent);
			done(null, results);
		});
};

var convertXmlToJson = function(data, options, done) {
	var parse = require('xml2js').parseString;
	parse(data, options, function(err, result) {
		var results = JSON.stringify(result, null, options.indent);
		done(null, results);
	});
};

var convertYmlToJson = function(data, options, done) {
	var results = JSON.stringify(YAML.load(data, {fromFile: true}), null, options.indent);
	done(null, results);
};

var convertPlistToJson = function(data, options, done) {
	var results = JSON.stringify(plist.parseFileSync(data), null, options.indent);
	done(null, results);
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

var convertJsonToXml = function(data, options, done) {
	options.xml.header = options.header ? options.header : options.xml.header;
	data = toXml(JSON.parse(data), options.xml);
	data = (options.pretty) ? require('pretty-data').pd.xml(data) : data;
	done(null, data);
};

var convertJsonToYml = function(data, options, done) {
	var results = YAML.stringify(JSON.parse(data), options.inline, options.indent);
	done(null, results);
};

var convertJsonToPlist = function(data, options, done) {
	var results = plist.build(JSON.parse(data)).toString();
	done(null, results);
};

var map = {

	'csv': {
		'json': convertCsvToJson
	},

	'xml': {
		'json': convertXmlToJson
	},

	'yml': {
		'json': convertYmlToJson
	},

	'plist': {
		'json': convertPlistToJson
	},

	'json': {
		'csv': convertJsonToCsv,
		'xml': convertJsonToXml,
		'yml': convertJsonToYml,
		'plist': convertJsonToPlist
	}

};

var convert = module.exports = function(options) {
	var opts = extend(options);
	var from = opts.from.toLowerCase();
	var to = opts.to.toLowerCase();
	var buffer = '';

	var converter = new stream.Transform();
	converter._transform = function(data, encoding, done) {
		buffer += data;
		done();
	};

	converter._flush = function(done) {
		map[from][to](buffer, opts, function(err, data) {
			if(err) {
				console.log('Error: ', err);
				return done();
			}
			converter.push(data);
			done();
		});
	};

	return converter;
};
