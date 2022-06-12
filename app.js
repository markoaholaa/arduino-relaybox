const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
global.io = new Server(server);
const router = require('./router/router');
const path = require('path');
const port = 2579;
const ioFunctions = require('./mqttio');
const db = require('./db/connect');

const Command = require('./db/models/command');
const command = require('./db/models/command');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
app.use('/static', express.static(path.join(__dirname, '/static')));
app.set('view engine', 'ejs');

server.listen(port, () => {
	console.log('listening on', port);
});