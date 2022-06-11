const socket = io();

const buttons = document.querySelectorAll('.command');
const dangerousControl = document.querySelector('.danger');
const confirmButton = document.getElementById('confirmDangerous');
const cancelButton = document.getElementById('cancelDangerous');

const overlay = document.querySelector('.overlay');

buttons.forEach(btn => {
	btn.addEventListener('click', () => {

		const dangerous = btn.getAttribute('data-danger');
		const address = btn.getAttribute('data-address');

		if (dangerous === 'true') {

			if (btn.classList.contains('icon-activated')) {
				return socket.emit('button press', address);
			}

			dangerousControl.classList.add('danger-visible');
			overlay.classList.add('overlay-active');

			cancelButton.addEventListener('click', () => {
				dangerousControl.classList.remove('danger-visible');
				overlay.classList.remove('overlay-active');
			});

			confirmButton.addEventListener('click', () => {
				dangerousControl.classList.remove('danger-visible');
				overlay.classList.remove('overlay-active');
				console.log('Sending: ', address); // For some reason it sends the previous address again.
				return socket.emit('button press', address);
			});
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

// Listeners

// I had to divide the updates into 2 groups.

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

});