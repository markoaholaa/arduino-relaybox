require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURI, {
	useNewUrlParser: true
}, (err) => {
	if (!err) console.log('DB OK');
});

module.exports = mongoose.connection;