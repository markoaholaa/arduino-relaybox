const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
	address: {
		type: String,
		unique: true
	},
	icon: String,
	location: String,
	dangerous: Boolean,
	turnedOn: Number,
	active: Boolean
});

module.exports = new mongoose.model('Command', commandSchema);