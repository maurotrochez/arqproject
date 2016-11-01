//var config = require('./config');
var mongoose = require('mongoose');

//mongoose.connect(config.db.name);
mongoose.connect('localhost:27017/arqdb');

mongoose.connection.on('connected', function () {
	console.log('Mongoose connected to localhost:27017/arqdb');
});

mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected: app termination');
		process.exit(0);
	});
});

var measureSchema = new mongoose.Schema({
	variable: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		index: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now,
		index: true
	},
	val: {
		type: Number,
		required: true,
		index: true
	}
});

mongoose.model('Measure', measureSchema, 'measures');

var variableSchema = new mongoose.Schema({
	label: {
		type: String,
		required: true,
		index: true
	},
	sensor: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		index: true
	}
});

mongoose.model('Variable', variableSchema, 'variables');

var sensorSchema = new mongoose.Schema({
	tagId: {
		type: String,
		required: true,
		index: true
	},
	label: {
		type: String,
		required: true,
		index: true
	}
});

mongoose.model('Sensor', sensorSchema, 'sensors');

