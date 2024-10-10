// Toggle Navigation Menu on Hamburger Click
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
