document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const navbarHeight = 130;
        const section = document.querySelector(this.getAttribute('href'));
        const sectionPosition = section.getBoundingClientRect().top;

        window.scrollBy({
            top: sectionPosition - navbarHeight,
            behavior: 'smooth'
        });
    });
});



const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  const registerButton = document.querySelector('.register');

  hamburgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    registerButton.style.display = navLinks.classList.contains('show') ? 'none' : 'block';
  });