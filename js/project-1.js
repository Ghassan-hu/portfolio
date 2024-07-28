function phonenav() {
    const navbarLinks = document.getElementById('navbar-links');
    if (navbarLinks.style.display === 'flex') {
        navbarLinks.style.display = 'none';
    } else {
        navbarLinks.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const navbarLinks = document.getElementById('navbar-links');
    const links = navbarLinks.getElementsByTagName('a');
    for (let link of links) {
        link.addEventListener('click', () => {
            navbarLinks.style.display = 'none';
        });
    }
});
