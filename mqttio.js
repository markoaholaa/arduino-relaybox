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

client.on('message', async function (topic, message) {
	if (topic === 'homecontrolupdate') {
		const update = JSON.parse(message.toString());

		if (update.group === 'first') {
			// We have addresses 0 - 5
			io.emit('first group', update);
		} else if (update.group === 'second') {
			io.emit('second group', update);
		}
	}
});

// WebSocket stuff

io.on('connection', (socket) => {

	socket.on('button press', (address) => {
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