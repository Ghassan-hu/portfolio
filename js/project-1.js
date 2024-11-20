function toggleMenu() {
    const menu = document.getElementById('navbar-links');
    menu.classList.toggle('active');
}
function validateForm() {
    const text = document.getElementById('text').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    if (text && email && phone && message) {
        alert('הודעתך נשלחה בהצלחה!');
    } else {
        alert('לא ניתן לשלוח הודעה עם שדות ריקים.');
    }
}

function phonenav() {
    const navbarLinks = document.getElementById('navbar-links');
    if (navbarLinks.style.display === 'flex') {
        navbarLinks.style.display = 'none';
    } else {
        navbarLinks.style.display = 'flex';
    }
}