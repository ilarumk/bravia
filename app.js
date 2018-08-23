var express = require('express');
var http = require('http');
var app = express();
var bravia = require('./lib');

app.set('port', process.env.PORT || 1337);

app.get('/tv', function (request, response) {
	var availableCommands = [];
	// Accepts two parameters: IP and PSKKey
	bravia('192.168.0.90', '0000', function (client) {
		// List available commands
		client.getCommandNames(function (list) {
			var command = request.query.command;
			availableCommands = list.split(',');
			availableCommands = availableCommands.map(function (el) {
  				return el.trim();
			});
			console.log(command);
			//command = 'Netflix';
			commandExists = availableCommands.includes(command);
			if (commandExists) {
				client.exec(command);
				response.contentType('text/json');
				response.status(200).send({
					status: 'ok',
					command: command
				});
			} else {
				response.status(500).send({
					status: 'invalid'
				});
			}
		});
	});
});


http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});