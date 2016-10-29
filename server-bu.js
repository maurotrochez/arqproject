var q = require('q');
var app = require('express')();
var mongoose = require('mongoose');
var bodyParser  = require('body-parser');
var schemas = require('./schemas');
var Measure = mongoose.model('Measure');
var Variable = mongoose.model('Variable');
var Sensor = mongoose.model('Sensor');

app.use(bodyParser.text({ type: 'application/json' }));

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

app.post('/', function(req, res) {

});

app.post('/publish', function (req, res) {
	var trama = JSON.parse(req.body);

	console.log('req.body: ' + req.body);

	data = {
		_id: null,
		tagId: trama.tagId,
		valores: trama.valores,
		variables: Object.keys(trama.valores)
	};

	getSensor(data)
	.then(getVariables)
	.then(setMeasure)
	.then(function(data){
			res.send(data);
	});
});

function getSensor(data) {
	var deferred = q.defer();

	Sensor.findOne({'tagId' : data.tagId}, function(err, sensor) {
		if(!err){
			if(!sensor){
				console.log('No existe el sensor : ' + data.tagId);
			}else{
				data._id = sensor._id;
				console.log("getSensor if else JSON.stringify(sensor): " + JSON.stringify(sensor));
				console.log('else getPointId sensor._id : ' + sensor._id);
				console.log('else getPointId sensor.label : ' + sensor.label);

				deferred.resolve(data);
			}
		}else{
			console.log('Error buscando el sensor : ' + err);
		}
	});
	return deferred.promise;
};

function getVariables(datos) {
	var deferred = q.defer();

	Variable.find({'sensor' : mongoose.Types.ObjectId(datos._id), 'label' : {$in : data.variables}}, {'_id' : 1, 'label' : 1}, function(err, variable) {

		console.log('getVariables JSON.stringify(variable) ' + JSON.stringify(variable));

		data.variables = variable;
		deferred.resolve(data);

	});
	return deferred.promise;
};

function setMeasure(data) {
	var deferred = q.defer();
	var variables = data.variables;

	variables.map(function (variable) {

		console.log('setMeasure variable._id: ' + variable._id);
		console.log('setMeasure data.valores[variable.label]: ' + data.valores[variable.label]);

		var measureOne = new Measure({ 
			variable : mongoose.Types.ObjectId(variable._id),
			val : data.valores[variable.label]
		});

		measureOne.save(function (err) {
			if(!err){
				console.log('Measure saved!');
				console.log(JSON.stringify(measureOne));
			}else{
				console.log(err);
			}
		});

	});

	return deferred.promise;
}
