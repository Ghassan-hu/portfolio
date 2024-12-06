// Table data storage
const tables = Array(10).fill().map((_, index) => ({
    id: index + 1,
    occupied: false,
    numPeople: 0,
    orders: [],
    tipPercentage: 15
}));

// Menu data storage
const menuData = {
    categories: [],
    items: {}
};

// Function to update statistics
function updateStatistics() {
    const totalCustomers = tables.reduce((sum, table) => sum + table.numPeople, 0);
    const occupiedTablesCount = tables.filter(table => table.numPeople > 0).length;
    
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('occupiedTables').textContent = occupiedTablesCount;
}

// Initialize tables
function initializeTables() {
    const container = document.querySelector('.tables-container');
    container.innerHTML = ''; // Clear existing tables
    
    tables.forEach(table => {
        const status = getTableStatus(table);
        const statusColor = getStatusColor(status);
        const tableElement = document.createElement('div');
        tableElement.className = `table ${statusColor}`;
        tableElement.innerHTML = `
            <div class="table-header">
                <h3>Table ${table.id}</h3>
                ${table.numPeople > 0 ? `<div class="people-info"><i class="fas fa-users"></i> ${table.numPeople}</div>` : ''}
            </div>
            <i class="fas fa-utensils"></i>
            <p class="status ${statusColor}">${status}</p>
        `;
        tableElement.onclick = () => openTableModal(table);
        container.appendChild(tableElement);
    });
    
    updateStatistics();
}

function getTableStatus(table) {
    if (table.numPeople > 0) {
        if (table.orders.length > 0) {
            return 'Dining';
        }
        return 'Seated';
    } else if (table.orders.length > 0) {
        return 'Ordered';
    }
    return 'Available';
}

function getStatusColor(status) {
    switch (status) {
        case 'Dining':
            return 'dining';
        case 'Seated':
            return 'seated';
        case 'Ordered':
            return 'ordered';
        default:
            return '';
    }
}

// Modal functionality
const modal = document.getElementById('tableModal');
const menuModal = document.getElementById('menuModal');
const closeBtns = document.querySelectorAll('.close');

// Add click event to all close buttons
closeBtns.forEach(btn => {
    btn.onclick = function() {
        const modalToClose = this.closest('.modal');
        if (modalToClose) {
            modalToClose.style.display = 'none';
            if (modalToClose === modal) {
                currentTable = null;
            }
        }
    };
});

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        if (event.target === modal) {
            currentTable = null;
        }
    }
};

function closeModal() {
    modal.style.display = 'none';
    menuModal.style.display = 'none';
    currentTable = null;
}

let currentTable = null;

function openTableModal(table) {
    currentTable = table;
    modal.style.display = 'block';
    updateModalContent();
}

function updateModalContent() {
    document.getElementById('tableNumber').textContent = currentTable.id;
    const numPeopleInput = document.getElementById('numPeople');
    numPeopleInput.value = currentTable.numPeople || 1;
    
    // Add event listener for immediate table status update
    numPeopleInput.addEventListener('input', function() {
        const numPeople = parseInt(this.value) || 0;
        currentTable.numPeople = numPeople;
        currentTable.occupied = numPeople > 0;
        updateTableDisplay();
        updateStatistics();
    });
    
    // Update orders list
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    currentTable.orders.forEach((order, index) => {
        addOrderToModal(order.item, order.price, order.quantity || 1, index);
    });
    
    // Update tip selection
    document.getElementById('tipPercentage').value = currentTable.tipPercentage;
    
    updateTotalCalculations();
}

// Order management
document.getElementById('addOrder').onclick = () => {
    addOrderToModal('', 0);
};

function addOrderToModal(item = '', price = 0, quantity = 1) {
    const ordersList = document.getElementById('ordersList');
    
    // Check if item already exists
    const existingOrders = Array.from(ordersList.querySelectorAll('.order-item'));
    const existingOrder = existingOrders.find(order => {
        const itemName = order.querySelector('.order-item-name').value;
        const itemPrice = parseFloat(order.querySelector('.order-price').value);
        return itemName === item && itemPrice === price;
    });

    if (existingOrder && item && price) {
        // Update quantity of existing order
        const quantityInput = existingOrder.querySelector('.order-quantity');
        const currentQuantity = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentQuantity + 1;
        updateTotalCalculations();
        return;
    }

    // Create new order if not exists
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-item';
    orderDiv.innerHTML = `
        <input type="text" placeholder="Item" value="${item}" class="order-item-name">
        <input type="number" placeholder="Price" value="${price}" step="0.01" min="0" class="order-price">
        <input type="number" value="${quantity}" min="1" class="order-quantity" title="Quantity">
        <button class="btn secondary" onclick="removeOrder(this)">Remove</button>
    `;
    
    // Add event listeners for real-time calculation updates
    const inputs = orderDiv.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateTotalCalculations);
    });
    
    ordersList.appendChild(orderDiv);
}

function removeOrder(button) {
    button.parentElement.remove();
    updateTotalCalculations();
}

// Calculations
function updateTotalCalculations() {
    const orders = document.querySelectorAll('.order-item');
    let subtotal = 0;
    
    orders.forEach(order => {
        const price = parseFloat(order.querySelector('.order-price').value) || 0;
        const quantity = parseInt(order.querySelector('.order-quantity').value) || 1;
        subtotal += price * quantity;
    });
    
    const tipSelect = document.getElementById('tipPercentage');
    const customTipInput = document.getElementById('customTip');
    let tipPercentage = parseFloat(tipSelect.value);
    
    if (tipSelect.value === 'custom') {
        customTipInput.classList.remove('hidden');
        tipPercentage = parseFloat(customTipInput.value) || 0;
    } else {
        customTipInput.classList.add('hidden');
    }
    
    const tipAmount = subtotal * (tipPercentage / 100);
    const total = subtotal + tipAmount;
    
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
}

// Save table data
document.getElementById('saveTable').onclick = () => {
    const numPeople = parseInt(document.getElementById('numPeople').value) || 0;
    const orders = [];
    document.querySelectorAll('.order-item').forEach(order => {
        const item = order.querySelector('.order-item-name').value;
        const price = parseFloat(order.querySelector('.order-price').value) || 0;
        const quantity = parseInt(order.querySelector('.order-quantity').value) || 1;
        if (item && price > 0) {
            orders.push({ item, price, quantity });
        }
    });
    
    const tipSelect = document.getElementById('tipPercentage');
    const tipPercentage = tipSelect.value === 'custom' 
        ? parseFloat(document.getElementById('customTip').value) 
        : parseFloat(tipSelect.value);
    
    // Update table data
    currentTable.occupied = orders.length > 0;
    currentTable.numPeople = numPeople;
    currentTable.orders = orders;
    currentTable.tipPercentage = tipPercentage;
    
    // Update table display
    updateTableDisplay();
    updateStatistics();
    closeModal();
};

// Clear table
document.getElementById('clearTable').onclick = () => {
    currentTable.occupied = false;
    currentTable.numPeople = 0;
    currentTable.orders = [];
    currentTable.tipPercentage = 15;
    updateTableDisplay();
    updateStatistics();
    closeModal();
};

function updateTableDisplay() {
    const tables = document.querySelectorAll('.table');
    const tableElement = tables[currentTable.id - 1];
    const status = getTableStatus(currentTable);
    const statusColor = getStatusColor(status);
    
    // Remove all status classes
    tableElement.classList.remove('dining', 'seated', 'ordered');
    if (statusColor) {
        tableElement.classList.add(statusColor);
    }
    
    const peopleInfo = tableElement.querySelector('.people-info');
    if (peopleInfo) {
        peopleInfo.textContent = `${currentTable.numPeople}`;
    } else if (currentTable.numPeople > 0) {
        const tableHeader = tableElement.querySelector('.table-header');
        const peopleInfo = document.createElement('div');
        peopleInfo.className = 'people-info';
        peopleInfo.innerHTML = `<i class="fas fa-users"></i> ${currentTable.numPeople}`;
        tableHeader.appendChild(peopleInfo);
    }
    
    const statusElement = tableElement.querySelector('p');
    statusElement.textContent = status;
    statusElement.className = `status ${statusColor}`;
}

// Tip percentage change handler
document.getElementById('tipPercentage').onchange = function() {
    const customTipInput = document.getElementById('customTip');
    if (this.value === 'custom') {
        customTipInput.classList.remove('hidden');
    } else {
        customTipInput.classList.add('hidden');
    }
    updateTotalCalculations();
};

document.getElementById('customTip').oninput = updateTotalCalculations;

// Menu Management
const manageMenuBtn = document.getElementById('manageMenu');
const addCategoryBtn = document.getElementById('addCategory');
const addMenuItemBtn = document.getElementById('addMenuItem');

manageMenuBtn.onclick = () => {
    menuModal.style.display = 'block';
    updateCategoriesDisplay();
};

// Close menu modal when clicking close button or outside
menuModal.querySelector('.close').onclick = () => {
    menuModal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === menuModal) {
        menuModal.style.display = 'none';
    }
};

// Add category
addCategoryBtn.onclick = () => {
    const categoryInput = document.getElementById('newCategory');
    const categoryName = categoryInput.value.trim();
    
    if (categoryName && !menuData.categories.includes(categoryName)) {
        menuData.categories.push(categoryName);
        menuData.items[categoryName] = [];
        categoryInput.value = '';
        updateCategoriesDisplay();
        updateCategorySelects();
    }
};

// Add menu item
addMenuItemBtn.onclick = () => {
    const category = document.getElementById('itemCategory').value;
    const name = document.getElementById('newItemName').value.trim();
    const price = parseFloat(document.getElementById('newItemPrice').value);
    
    if (category && name && price > 0) {
        menuData.items[category].push({ name, price });
        document.getElementById('newItemName').value = '';
        document.getElementById('newItemPrice').value = '';
        updateMenuItemsDisplay();
        updateMenuItemSelect();
    }
};

// Update categories display
function updateCategoriesDisplay() {
    const categoriesList = document.getElementById('categoriesList');
    const itemCategorySelect = document.getElementById('itemCategory');
    
    categoriesList.innerHTML = '';
    itemCategorySelect.innerHTML = '<option value="">Select Category</option>';
    
    menuData.categories.forEach(category => {
        // Add to categories list
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.innerHTML = `
            <span>${category}</span>
            <button onclick="removeCategory('${category}')">Remove</button>
        `;
        categoriesList.appendChild(categoryDiv);
        
        // Add to category select
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        itemCategorySelect.appendChild(option);
    });
}

// Remove category with password protection
function removeCategory(category) {
    const password = prompt("Please enter the password to remove this category:");
    if (password !== "123456") {
        showCustomPopup("Incorrect password! Cannot remove the category.", true);
        return;
    }
    
    const categoryIndex = menuData.categories.indexOf(category);
    if (categoryIndex > -1) {
        menuData.categories.splice(categoryIndex, 1);
        delete menuData.items[category];
        updateCategoriesDisplay();
        updateMenuItemsDisplay();
        updateCategorySelects();
        showCustomPopup("Category successfully removed!");
    }
}

// Update menu items display
function updateMenuItemsDisplay() {
    const menuItemsList = document.getElementById('menuItemsList');
    const selectedCategory = document.getElementById('itemCategory').value;
    
    menuItemsList.innerHTML = '';
    
    if (selectedCategory && menuData.items[selectedCategory]) {
        menuData.items[selectedCategory].forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';
            itemDiv.innerHTML = `
                <span>${item.name} - $${item.price.toFixed(2)}</span>
                <button onclick="removeMenuItem('${selectedCategory}', ${index})">Remove</button>
            `;
            menuItemsList.appendChild(itemDiv);
        });
    }
}

// Remove menu item with password protection
function removeMenuItem(category, index) {
    const password = prompt("Please enter the password to remove this menu item:");
    if (password !== "123456") {
        showCustomPopup("Incorrect password! Cannot remove the menu item.", true);
        return;
    }
    
    menuData.items[category].splice(index, 1);
    updateMenuItemsDisplay();
    showCustomPopup("Menu item successfully removed!");
}

// Update category selects in the table modal
function updateCategorySelects() {
    const menuCategorySelect = document.getElementById('menuCategorySelect');
    menuCategorySelect.innerHTML = '<option value="">Select Category</option>';
    
    menuData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        menuCategorySelect.appendChild(option);
    });
}

// Update menu item select based on selected category
function updateMenuItemSelect() {
    const categorySelect = document.getElementById('menuCategorySelect');
    const itemSelect = document.getElementById('menuItemSelect');
    const category = categorySelect.value;
    
    itemSelect.innerHTML = '<option value="">Select Item</option>';
    
    if (category && menuData.items[category]) {
        menuData.items[category].forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            itemSelect.appendChild(option);
        });
    }
}

// Event listeners for menu selection
document.getElementById('menuCategorySelect').onchange = updateMenuItemSelect;

document.getElementById('addSelectedItem').onclick = () => {
    const category = document.getElementById('menuCategorySelect').value;
    const itemIndex = document.getElementById('menuItemSelect').value;
    
    if (category && itemIndex !== '') {
        const item = menuData.items[category][itemIndex];
        addOrderToModal(item.name, item.price);
    }
};

// Custom popup message functions
function showCustomPopup(message, isError = false) {
    const popup = document.createElement('div');
    popup.className = `custom-popup ${isError ? 'error' : 'success'}`;
    popup.innerHTML = `
        <div class="popup-content">
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 3000);
}

// Add styles for the popup
const styles = document.createElement('style');
styles.textContent = `
    .custom-popup {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    }
    
    .popup-content {
        background: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .custom-popup.error .popup-content {
        border-left: 4px solid #ff4444;
    }
    
    .custom-popup.success .popup-content {
        border-left: 4px solid #00C851;
    }
    
    .custom-popup p {
        margin: 0;
        font-size: 14px;
    }
    
    .custom-popup button {
        padding: 5px 10px;
        border: none;
        border-radius: 3px;
        background: #eee;
        cursor: pointer;
    }
    
    .custom-popup button:hover {
        background: #ddd;
    }
    
    .custom-popup button:active {
        transform: translateY(0);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(styles);

// Function to add a new table
function addNewTable() {
    const newTableId = tables.length + 1;
    tables.push({
        id: newTableId,
        occupied: false,
        numPeople: 0,
        orders: [],
        tipPercentage: 15
    });
    initializeTables();
    showCustomPopup(`New table ${newTableId} has been added successfully!`);
}

// Add styles for the add table button
const addTableStyles = document.createElement('style');
addTableStyles.textContent = `
    .add-table-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: transform 0.2s, background-color 0.2s;
    }

    .add-table-btn:hover {
        background-color: #45a049;
        transform: translateY(-2px);
    }

    .add-table-btn:active {
        transform: translateY(0);
    }
`;
document.head.appendChild(addTableStyles);

// Create and add the button to the page
const addTableBtn = document.createElement('button');
addTableBtn.className = 'add-table-btn';
addTableBtn.innerHTML = '<i class="fas fa-plus"></i> Add Table';
addTableBtn.onclick = addNewTable;
document.body.appendChild(addTableBtn);

// Add some default menu items
function addDefaultMenuItems() {
    // Add categories
    const defaultCategories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];
    defaultCategories.forEach(category => {
        if (!menuData.categories.includes(category)) {
            menuData.categories.push(category);
            menuData.items[category] = [];
        }
    });

    // Add some sample items
    const sampleItems = {
        'Appetizers': [
            { name: 'Caesar Salad', price: 8.99 },
            { name: 'Garlic Bread', price: 4.99 },
            { name: 'Soup of the Day', price: 6.99 }
        ],
        'Main Course': [
            { name: 'Grilled Salmon', price: 24.99 },
            { name: 'Beef Steak', price: 29.99 },
            { name: 'Pasta Carbonara', price: 18.99 }
        ],
        'Desserts': [
            { name: 'Chocolate Cake', price: 7.99 },
            { name: 'Ice Cream', price: 5.99 },
            { name: 'Apple Pie', price: 6.99 }
        ],
        'Beverages': [
            { name: 'Soft Drinks', price: 2.99 },
            { name: 'Coffee', price: 3.99 },
            { name: 'Fresh Juice', price: 4.99 }
        ]
    };

    Object.keys(sampleItems).forEach(category => {
        menuData.items[category] = [...sampleItems[category]];
    });

    updateCategoriesDisplay();
    updateCategorySelects();
}

// Initialize the application
initializeTables();
addDefaultMenuItems();
