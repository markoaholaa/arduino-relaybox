const express = require('express');
const router = express.Router();

const Command = require('../db/models/command');

router.get('/', async (req, res) => {
	const commands = await Command.find({}).sort({ address: 1 }).exec();

	res.render('home', {
		commands: commands
	});
});

router.get('/ohjaukset', async (req, res) => {

	const commands = await Command.find({}).sort({ address: 1 }).exec();
	const usedAddressess = commands.map(a => a.address);

	console.log(usedAddressess);

	res.render('commands', {
		commands: commands,
		used: usedAddressess
	});
});


// POST

router.post('/newCommand', (req, res) => {

	const danger = (req.body.dangerous === "true") ? true : false;

	const cmd = new Command({
		address: req.body.address,
		icon: req.body.icon,
		location: req.body.location,
		dangerous: danger
	});

	cmd.save((err) => {
		if (err) {
			return res.redirect('/ohjaukset');
		}

		res.redirect('/');
	});
});

module.exports = router;