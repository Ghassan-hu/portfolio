function phonenav() {
    const navbarLinks = document.getElementById('navbar-links');
    if (navbarLinks.style.display === 'flex') {
        navbarLinks.style.display = 'none';
    } else {
        navbarLinks.style.display = 'flex';
    }
}