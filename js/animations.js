// Reveal elements on scroll
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Set card animation delays
function setCardDelays() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
}

// Initialize animations
window.addEventListener('scroll', reveal);
window.addEventListener('load', () => {
    setCardDelays();
    reveal();
});
