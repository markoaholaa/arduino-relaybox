const openNav = document.getElementById('menuButton');
const closeNav = document.getElementById('closeButton');
const menu = document.querySelector('.menu');

openNav.addEventListener('click', () => {
	menu.classList.add('menu-visible');
});

closeNav.addEventListener('click', () => {
	menu.classList.remove('menu-visible');
});