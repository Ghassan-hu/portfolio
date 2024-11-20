// Constants
const STORAGE_KEY = "USERS";
const ITEMS_PER_PAGE = 5;

// State
let USERS = [];
let currentUser = null;
let currentPage = 1;

// DOM Elements
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const userTable = document.getElementById("userTable");
const alertArea = document.getElementById("alertArea");
const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));

// Initialize
loadUsers();
setupEventListeners();
populateUserTable();

// Event Listeners Setup
function setupEventListeners() {
    registerForm.addEventListener("submit", handleRegister);
    loginForm.addEventListener("submit", handleLogin);
    document.getElementById("navRegister").addEventListener("click", () => showSection("registerSection"));
    document.getElementById("navLogin").addEventListener("click", () => showSection("loginSection"));
    document.getElementById("navLogout").addEventListener("click", handleLogout);
    document.getElementById("togglePassword").addEventListener("click", () => togglePasswordVisibility("password"));
    document.getElementById("toggleLoginPassword").addEventListener("click", () => togglePasswordVisibility("loginPassword"));
    document.getElementById("password").addEventListener("input", updatePasswordStrength);
    document.getElementById("saveUserEdit").addEventListener("click", saveUserEdit);
}

// User Management Functions
function handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!validatePasswordRequirements(password)) {
        showAlert("הסיסמה חייבת לכלול לפחות מספר אחד וסמל אחד", "danger");
        return;
    }

    if (firstName && lastName && isValidEmail(email) && password.length >= 8) {
        if (USERS.some(user => user.email === email)) {
            showAlert("כתובת האימייל כבר רשומה במערכת", "danger");
            return;
        }

        const newUser = { firstName, lastName, email, password };
        USERS.push(newUser);
        saveUsers();
        showAlert("ההרשמה הושלמה בהצלחה!", "success");
        registerForm.reset();
        populateUserTable();
    } else {
        showAlert("אנא מלא את כל השדות כראוי", "danger");
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const user = USERS.find(user => user.email === email && user.password === password);
    if (user) {
        currentUser = user;
        showAlert(`ברוך הבא, ${user.firstName}!`, "success");
        showUserManagementOptions();
    } else {
        showAlert("אימייל או סיסמה שגויים", "danger");
    }
}

function handleLogout() {
    currentUser = null;
    showSection("loginSection");
    document.getElementById("navLogout").style.display = "none";
    showAlert("התנתקת בהצלחה", "info");
}

function deleteUser(index) {
    if (confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
        USERS.splice(index, 1);
        saveUsers();
        populateUserTable();
        showAlert("המשתמש נמחק בהצלחה", "success");
    }
}

function editUser(index) {
    const user = USERS[index];
    document.getElementById("editFirstName").value = user.firstName;
    document.getElementById("editLastName").value = user.lastName;
    document.getElementById("saveUserEdit").setAttribute("data-index", index);
    editUserModal.show();
}

function saveUserEdit() {
    const index = parseInt(document.getElementById("saveUserEdit").getAttribute("data-index"));
    const firstName = document.getElementById("editFirstName").value.trim();
    const lastName = document.getElementById("editLastName").value.trim();

    if (firstName && lastName) {
        USERS[index].firstName = firstName;
        USERS[index].lastName = lastName;
        saveUsers();
        populateUserTable();
        editUserModal.hide();
        showAlert("פרטי המשתמש עודכנו בהצלחה", "success");
    } else {
        showAlert("אנא מלא את כל השדות", "danger");
    }
}

function disconnectUser(index) {
    if (confirm("האם אתה בטוח שברצונך לנתק משתמש זה?")) {
        // Here you would typically implement the logic to disconnect the user
        // For now, we'll just show an alert
        showAlert(`המשתמש ${USERS[index].firstName} ${USERS[index].lastName} נותק בהצלחה`, "warning");
    }
}

// Helper Functions
function loadUsers() {
    const storedUsers = localStorage.getItem(STORAGE_KEY);
    USERS = storedUsers ? JSON.parse(storedUsers) : [];
}

function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(USERS));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showSection(sectionId) {
    ["registerSection", "loginSection", "userListSection"].forEach(id => {
        document.getElementById(id).style.display = id === sectionId ? "block" : "none";
    });
}

function showUserManagementOptions() {
    document.getElementById("navLogout").style.display = "block";
    showSection("userListSection");
}

function populateUserTable() {
    userTable.innerHTML = "";
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedUsers = USERS.slice(start, end);

    paginatedUsers.forEach((user, index) => {
        const row = userTable.insertRow();
        row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser(${start + index})">ערוך</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${start + index})">מחק</button>
                <button class="btn btn-sm btn-warning" onclick="disconnectUser(${start + index})">נתק</button>
            </td>
        `;
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(USERS.length / ITEMS_PER_PAGE);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }
}

function changePage(page) {
    currentPage = page;
    populateUserTable();
}

function showAlert(message, type) {
    const alertElement = document.createElement("div");
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertArea.appendChild(alertElement);

    setTimeout(() => alertElement.remove(), 5000);
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
    }
}

function updatePasswordStrength() {
    const password = document.getElementById("password").value;
    const strengthBar = document.getElementById("passwordStrength");
    const strength = calculatePasswordStrength(password);
    strengthBar.style.width = `${strength}%`;
    strengthBar.className = `progress-bar ${getStrengthClass(strength)}`;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length > 7) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    if (password.match(/[$@#&!]+/)) strength += 25;
    return Math.min(100, strength);
}


function getStrengthClass(strength) {
    if (strength < 50) return "bg-danger";
    if (strength < 75) return "bg-warning";
    return "bg-success";
}

function validatePasswordRequirements(password) {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
}