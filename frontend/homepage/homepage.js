document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const navbarHeight = 120;
        const section = document.querySelector(this.getAttribute('href'));
        const sectionPosition = section.getBoundingClientRect().top;

        window.scrollBy({
            top: sectionPosition - navbarHeight,
            behavior: 'smooth'
        });
    });
});