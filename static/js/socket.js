const socket = io();

const buttons = document.querySelectorAll('.command');
const dangerousControl = document.querySelector('.danger');
const confirmButton = document.getElementById('confirmDangerous');
const cancelButton = document.getElementById('cancelDangerous');

const overlay = document.querySelector('.overlay');

let address = '';

buttons.forEach(btn => {
	btn.addEventListener('click', () => {

		const dangerous = btn.getAttribute('data-danger');
		address = btn.getAttribute('data-address');

		if (dangerous === 'true') {

			if (btn.classList.contains('icon-activated')) {
				return socket.emit('button press', address);
			}

			dangerousControl.classList.add('danger-visible');
			overlay.classList.add('overlay-active');

		} else {
			if (btn.classList.contains('icon-activated')) {
				btn.classList.remove('icon-activated');
			} else {
				btn.classList.add('icon-activated');
			}

			socket.emit('button press', address);
		}

	});
});

confirmButton.addEventListener('click', () => {
	const addr = address;

	socket.emit('button press', addr);
	dangerousControl.classList.remove('danger-visible');
	overlay.classList.remove('overlay-active');
});

cancelButton.addEventListener('click', () => {
	dangerousControl.classList.remove('danger-visible');
	overlay.classList.remove('overlay-active');
});

// Listeners

// I had to divide the updates into 2 groups.

const dataReceivedIcon = document.getElementById('dataReceived');

socket.on('first group', (data) => {

	for (i = 0; i <= 5; i++) {
		const box = document.querySelector(`[data-address="${i.toString()}"]`);
		if (box) {
			if (data[`add${i.toString()}`] === "1") {
				box.classList.add('icon-activated');
			} else {
				box.classList.remove('icon-activated');
			}
		}
	}

	dataReceivedIcon.style.display = 'block';
	setTimeout(() => {
		dataReceivedIcon.style.display = 'none';
	}, 100);

});

socket.on('second group', (data) => {

	for (i = 6; i <= 11; i++) {
		const box = document.querySelector(`[data-address="${i.toString()}"]`);
		if (box) {
			if (data[`add${i.toString()}`] === "1") {
				box.classList.add('icon-activated');
			} else {
				box.classList.remove('icon-activated');
			}
		}
	}

	dataReceivedIcon.style.display = 'block';
	setTimeout(() => {
		dataReceivedIcon.style.display = 'none';
	}, 100);

});

const arduinoAlert = document.getElementById('arduinoDead');
const noConnection = document.querySelector('.no-connection');

socket.on('arduino dead', (msg) => {
	if (msg) {
		noConnection.style.display = 'block';
	} else {
		noConnection.style.display = 'none';
	}
});