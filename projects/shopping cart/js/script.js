function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemPrice = document.getElementById('itemPrice').value;
    if (itemName && itemPrice) {
        addItemToTable(itemName, itemPrice);
        saveItems();
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';
    } else {
        alert('Please enter both item name and price.');
    }
}

function addItemToTable(name, price) {
    const table = document.getElementById('productTable');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td>${price}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteItem(this)"><i class="fas fa-trash"></i> Delete</button></td>
    `;
    table.appendChild(row);
}

function deleteItem(button) {
    const row = button.closest('tr');
    row.remove();
    saveItems();
}

function saveItems() {
    const table = document.getElementById('productTable');
    const items = [];
    for (const row of table.rows) {
        items.push({
            name: row.cells[0].textContent,
            price: row.cells[1].textContent
        });
    }
    localStorage.setItem('shoppingCartItems', JSON.stringify(items));
}

function loadItems() {
    const items = JSON.parse(localStorage.getItem('shoppingCartItems')) || [];
    const table = document.getElementById('productTable');
    table.innerHTML = ''; // Clear existing items
    items.forEach(item => addItemToTable(item.name, item.price));
}

// Load items from local storage when the page loads
document.addEventListener('DOMContentLoaded', loadItems);