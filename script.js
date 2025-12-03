// ===== DOM elements =====
const todoForm = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task-input");
const categorySelect = document.querySelector("#category-select");
const prioritySelect = document.querySelector("#priority-select");
const dueDateInput = document.querySelector("#due-date");

const taskListEl = document.querySelector("#task-list");
const emptyStateEl = document.querySelector("#todo-empty");

const filterButtons = document.querySelectorAll(".filter-pill");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");

const statTotalEl = document.querySelector("#stat-total");
const statCompletedEl = document.querySelector("#stat-completed");
const statTodayEl = document.querySelector("#stat-today");
const clearCompletedBtn = document.querySelector("#clear-completed");

const themeToggle = document.querySelector("#theme-toggle");

// ===== Constants =====
const STORAGE_KEY_TASKS = "tasknestProTasks";
const STORAGE_KEY_THEME = "tasknestTheme";

const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

// ===== State =====
let tasks = loadTasks();
let currentFilter = FILTERS.ALL;
let currentSearch = "";
let currentSort = "created-desc";

// ===== Storage helpers =====
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
}

// ===== Theme =====
function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY_THEME);
  if (saved === "dark") {
    document.body.classList.add("theme-dark");
  }
}

function toggleTheme() {
  document.body.classList.toggle("theme-dark");
  const isDark = document.body.classList.contains("theme-dark");
  localStorage.setItem(STORAGE_KEY_THEME, isDark ? "dark" : "light");
}

// ===== Utility =====
function isDueToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function getPriorityWeight(priority) {
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

// Compute list after filter/search/sort
function getVisibleTasks() {
  let list = [...tasks];

  // Filter
  if (currentFilter === FILTERS.ACTIVE) {
    list = list.filter((t) => !t.completed);
  } else if (currentFilter === FILTERS.COMPLETED) {
    list = list.filter((t) => t.completed);
  }

  // Search
  if (currentSearch.trim() !== "") {
    const q = currentSearch.toLowerCase();
    list = list.filter((t) => t.text.toLowerCase().includes(q));
  }

  // Sort
  list.sort((a, b) => {
    if (currentSort === "created-desc") {
      return b.createdAt - a.createdAt;
    }
    if (currentSort === "created-asc") {
      return a.createdAt - b.createdAt;
    }
    if (currentSort === "due-asc") {
      const ad = a.dueDate || "";
      const bd = b.dueDate || "";
      if (ad === "" && bd === "") return 0;
      if (ad === "") return 1;
      if (bd === "") return -1;
      return new Date(ad) - new Date(bd);
    }
    if (currentSort === "priority-desc") {
      return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    }
    return 0;
  });

  return list;
}

// ===== Render =====
function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskListEl.innerHTML = "";

  if (visibleTasks.length === 0) {
    emptyStateEl.style.display = "block";
  } else {
    emptyStateEl.style.display = "block";
    emptyStateEl.textContent = `${visibleTasks.length} task${
      visibleTasks.length === 1 ? "" : "s"
    } in view.`;
  }

  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;
    if (task.completed) li.classList.add("completed");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;

    // main info
    const main = document.createElement("div");
    main.className = "task-main";

    const titleRow = document.createElement("div");
    titleRow.className = "task-title-row";

    const titleSpan = document.createElement("span");
    titleSpan.className = "task-label";
    titleSpan.textContent = task.text;

    const priorityPill = document.createElement("span");
    priorityPill.className =
      "task-pill task-tag-" + (task.priority || "medium");
    priorityPill.textContent =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    titleRow.appendChild(titleSpan);
    titleRow.appendChild(priorityPill);

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const catSpan = document.createElement("span");
    catSpan.className = "task-pill task-cat-" + (task.category || "other");
    const catLabelMap = {
      work: "Work",
      personal: "Personal",
      study: "Study",
      other: "Other",
    };
    catSpan.textContent = catLabelMap[task.category] || "Other";

    meta.appendChild(catSpan);

    if (task.dueDate) {
      const dueSpan = document.createElement("span");
      dueSpan.textContent =
        " · Due " + new Date(task.dueDate).toLocaleDateString();
      meta.appendChild(dueSpan);
    }

    main.appendChild(titleRow);
    main.appendChild(meta);

    // actions
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "task-delete";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.textContent = "×";

    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(main);
    li.appendChild(actions);

    taskListEl.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const today = tasks.filter((t) => isDueToday(t.dueDate)).length;

  statTotalEl.textContent = total;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  statCompletedEl.textContent = `${pct}%`;
  statTodayEl.textContent = today;
}

// ===== Event handlers =====
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now().toString(),
    text,
    category: categorySelect.value || "other",
    priority: prioritySelect.value || "medium",
    dueDate: dueDateInput.value || "",
    completed: false,
    createdAt: Date.now(),
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  // keep category/priority/due date as is
  taskInput.focus();
});

taskListEl.addEventListener("click", (e) => {
  const li = e.target.closest(".task-item");
  if (!li) return;
  const id = li.dataset.id;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;

  if (e.target.classList.contains("task-checkbox")) {
    tasks[index].completed = e.target.checked;
    saveTasks();
    renderTasks();
    return;
  }

  if (e.target.classList.contains("task-delete")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    return;
  }
});

// Filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter || FILTERS.ALL;
    renderTasks();
  });
});

// Search
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  renderTasks();
});

// Sort
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  renderTasks();
});

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
});

// Theme toggle
themeToggle.addEventListener("click", toggleTheme);

// ===== Init =====
loadTheme();
renderTasks();

