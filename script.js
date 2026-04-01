const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const clearAllBtn = document.getElementById("clearAllBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInfo() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const remaining = total - completed;

  totalTasks.textContent = `Total tasks: ${total}`;
  completedTasks.textContent = `Completed: ${completed}`;
  remainingTasks.textContent = `Remaining: ${remaining}`;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {

    if (currentFilter === "completed" && !task.completed) return;
    if (currentFilter === "pending" && task.completed) return;
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    span.addEventListener("click", function () {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", function () {
    const updatedText = prompt("Edit your task:", task.text);

    if (updatedText === null) {
        return;
    }

    const trimmedText = updatedText.trim();

    if (trimmedText === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = trimmedText;
    saveTasks();
    renderTasks();
    });

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateTaskInfo();
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

clearAllBtn.addEventListener("click", function () {
  const confirmClear = confirm("Are you sure you want to delete all tasks?");

  if (confirmClear) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});
