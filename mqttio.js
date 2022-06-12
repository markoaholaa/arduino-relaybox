require('dotenv').config();
const mqtt = require('mqtt');
const client = mqtt.connect(process.env.MQTT);

const Command = require('./db/models/command');

client.on('connect', function (err) {
	console.log('Connected to MQTT!');
	client.subscribe('homecontrol', (err) => {
		if (err) throw err;
		console.log('Subscribed to homecontrol');
	});

	client.subscribe('homecontrolupdate', (err) => {
		if (err) throw err;
		console.log('Subscribed to homecontrolupdate');
	});
});

client.on('error', (err) => {
	console.log('MQTT Error:', err);
});

let lastReceivedUpdate = Math.floor(Date.now() / 1000);

client.on('message', async function (topic, message) {
	if (topic === 'homecontrolupdate') {
		const update = JSON.parse(message.toString());

		if (update.group === 'first') {
			// We have addresses 0 - 5
			io.emit('first group', update);
		} else if (update.group === 'second') {
			io.emit('second group', update);
		}
		io.emit('arduino dead', false);
		lastReceivedUpdate = Math.floor(Date.now() / 1000);
	}
});

function checkIfArduinoAlive() {
	console.log('Checking if arduino is alive...');
	const dateNow = Math.floor(Date.now() / 1000);

	if (dateNow - lastReceivedUpdate > 60) {
		console.log('No message received from Arduino in over 60 seconds.');
		io.emit('arduino dead', true);
	}

	setTimeout(checkIfArduinoAlive, 10000);
}

checkIfArduinoAlive();

// WebSocket stuff

io.on('connection', (socket) => {

	socket.on('button press', async (address) => {

		const command = await Command.findOne({ address: address }).exec();

		if (command.dangerous && !command.active) {
			command.turnedOn = Math.floor(Date.now() / 1000);
			command.active = true;
			command.save();
		} else {
			command.active = false;
			command.save();
		}


		client.publish('homecontrol', address.toString());
	});

	socket.on('delete command', async (id) => {
		const command = await Command.findOne({ _id: id }).exec();

		Command.findOneAndDelete({ _id: id }, (err) => {
			if (err) throw err;
			socket.emit('delete command', id);
			client.publish('homecontroldelete', command.address);
		});
	});
});


/**
 * Automatic controls for addresses that control something fire hazard.
 */

const maxTimeForDangerous = 60 * 60; // In seconds

async function autoCommandOff() {

	console.log('Checking for controls that have been on for the max time.');

	const commands = await Command.find({}).exec();
	const dateNow = Math.floor(Date.now() / 1000);

	for (i = 0; i < commands.length; i++) {
		if (commands[i].active && dateNow - commands[i].turnedOn > maxTimeForDangerous) {
			console.log('Turning off address', commands[i].address);
			client.publish('forceoff', commands[i].address); // Lets command it to go off.
		}
	}

	setTimeout(autoCommandOff, 5000);
}

autoCommandOff();