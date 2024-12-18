class TodoManager {
    constructor(initialTodos = []) {
        this.todos = initialTodos;
        this.loadTodos(); // Load todos from local storage
    }

    loadTodos() {
        const storedTodos = JSON.parse(localStorage.getItem('todos'));
        if (storedTodos) {
            this.todos = storedTodos;
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo(title) {
        this.todos.push({ title: title, completed: false });
        this.saveTodos(); // Save todos to local storage
    }
}

// Initialize TodoManager and load todos
let todomanage = new TodoManager();
todomanage.loadTodos(); // Ensure todos are loaded from local storage

// Call showlists to display todos on page load
showlists();

function showlists() {
    document.getElementById("active").innerHTML = "";
    document.getElementById("completed").innerHTML = "";
    for (let todo of todomanage.todos) {
        if (!todo.completed) {
            document.getElementById("active").innerHTML += `
                <div>
                    <li class="list-group-item">${todo.title}</li>
                    <button class="btn btn-success" onclick="completeTodo('${todo.title}')"><i class="fas fa-check"></i> </button>
                    <button class="btn btn-warning" onclick="updateTodo('${todo.title}')"><i class="fas fa-edit"></i> </button>
                    <button class="btn btn-danger" onclick="deleteTodo('${todo.title}')"><i class="fas fa-trash"></i> </button>
                </div>`;
        } else {
            document.getElementById("completed").innerHTML += `
                <div>
                    <li class="list-group-item completed-task">${todo.title}</li>
                    <button class="btn btn-danger" onclick="deleteTodo('${todo.title}')"><i class="fas fa-trash"></i> </button>
                </div>`;
        }
    }
}

function completeTodo(title) {
    for (let todo of todomanage.todos) {
        if (todo.title === title) {
            todo.completed = true;
        }
    }
    todomanage.saveTodos(); // Save todos to local storage
    showlists();
}

let currentEditingTitle = null;

function updateTodo(title) {
    const inputElement = document.getElementById("floatingInput");
    const addButton = document.querySelector('.btn-success');

    // Set the input field to the current task title
    inputElement.value = title;
    currentEditingTitle = title;

    // Change the button text to "Update Task"
    addButton.innerHTML = '<i class="fas fa-edit"></i> Update Task';
    addButton.onclick = updateTask;
}

function updateTask() {
    const inputElement = document.getElementById("floatingInput");
    const newTitle = inputElement.value;
    const addButton = document.querySelector('.btn-success');

    if (newTitle.trim() !== "") {
        for (let todo of todomanage.todos) {
            if (todo.title === currentEditingTitle) {
                todo.title = newTitle;
            }
        }
        todomanage.saveTodos(); // Save todos to local storage
        showlists();
        inputElement.value = "";
        currentEditingTitle = null;

        // Change the button back to "Add Task"
        addButton.innerHTML = '<i class="fas fa-plus"></i> Add Task';
        addButton.onclick = addTask;
    } else {
        alert("Please enter a task title.");
    }
}

function deleteTodo(title) {
    for (let todo of todomanage.todos) {
        if (todo.title === title) {
            todomanage.todos.splice(todomanage.todos.indexOf(todo), 1);
        }
    }
    todomanage.saveTodos(); // Save todos to local storage
    showlists();
}

function addTask() {
    const inputElement = document.getElementById("floatingInput");
    const title = inputElement.value;
    const addButton = document.querySelector('.btn-success');

    if (title.trim() !== "") {
        addButton.classList.add('btn-crazy');
        setTimeout(() => {
            todomanage.addTodo(title);
            showlists();
            inputElement.value = "";
            addButton.classList.remove('btn-crazy');
        }, 1000); // Duration of the crazy animation
    } else {
        alert("Please enter a task title.");
    }
}