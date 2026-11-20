/* =============================================================
   To-Do Life Dashboard — script.js
   Single JavaScript file (RevoU requirement)

   Features implemented
   ─────────────────────
   MVP:
     • Add task
     • Mark task complete / incomplete
     • Delete task
     • Persist tasks across refreshes (localStorage)

   Challenges:
     C1 – Light / Dark Mode  (persisted to localStorage)
     C2 – Custom Name in Greeting  (persisted to localStorage)
     C3 – Prevent Duplicate Tasks  (case-insensitive, trimmed)

   localStorage keys used
   ──────────────────────
     "tasks"    → JSON array of task objects
     "theme"    → "light" | "dark"
     "userName" → string
============================================================= */

(function () {
  "use strict";

  /* ── DOM REFERENCES ──────────────────────────────────────── */
  var html           = document.documentElement;          // <html data-theme>
  var themeToggleBtn = document.getElementById("theme-toggle");
  var themeIcon      = document.getElementById("theme-icon");

  var greetingName   = document.getElementById("greeting-name");
  var nameInput      = document.getElementById("name-input");
  var nameSaveBtn    = document.getElementById("name-save-btn");

  var taskInput      = document.getElementById("task-input");
  var addTaskBtn     = document.getElementById("add-task-btn");
  var duplicateError = document.getElementById("duplicate-error");

  var taskList       = document.getElementById("task-list");
  var emptyState     = document.getElementById("empty-state");
  var taskCount      = document.getElementById("task-count");
  var filterBtns     = document.querySelectorAll(".btn--filter");

  /* ── STATE ───────────────────────────────────────────────── */
  var tasks         = [];   // Array of { id, text, completed }
  var currentFilter = "all"; // "all" | "active" | "completed"

  /* ==========================================================
     SECTION 1 — LOCAL STORAGE HELPERS
  ========================================================== */

  function loadTasks() {
    try {
      var stored = localStorage.getItem("tasks");
      tasks = stored ? JSON.parse(stored) : [];
    } catch (e) {
      tasks = [];
    }
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTheme() {
    try {
      return localStorage.getItem("theme") || "light";
    } catch (e) {
      return "light";
    }
  }

  function saveTheme(theme) {
    localStorage.setItem("theme", theme);
  }

  function loadUserName() {
    try {
      return localStorage.getItem("userName") || "";
    } catch (e) {
      return "";
    }
  }

  function saveUserName(name) {
    localStorage.setItem("userName", name);
  }

  /* ==========================================================
     SECTION 2 — CHALLENGE C1: LIGHT / DARK MODE
  ========================================================== */

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  function initTheme() {
    var saved = loadTheme();
    applyTheme(saved);
  }

  themeToggleBtn.addEventListener("click", function () {
    var current = html.getAttribute("data-theme");
    var next    = current === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });

  /* ==========================================================
     SECTION 3 — CHALLENGE C2: CUSTOM NAME IN GREETING
  ========================================================== */

  function applyUserName(name) {
    var display = name.trim() !== "" ? name.trim() : "Friend";
    greetingName.textContent = display;
  }

  function initUserName() {
    var saved = loadUserName();
    applyUserName(saved);
    nameInput.value = saved;
  }

  nameSaveBtn.addEventListener("click", function () {
    var name = nameInput.value.trim();
    applyUserName(name);
    saveUserName(name);
    nameInput.blur();
  });

  // Allow pressing Enter inside the name input to save
  nameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      nameSaveBtn.click();
    }
  });

  /* ==========================================================
     SECTION 4 — CHALLENGE C3: PREVENT DUPLICATE TASKS
  ========================================================== */

  function isDuplicate(text) {
    var normalised = text.trim().toLowerCase();
    return tasks.some(function (task) {
      return task.text.trim().toLowerCase() === normalised;
    });
  }

  function showDuplicateError(message) {
    duplicateError.textContent = message;
    duplicateError.classList.add("visible");
  }

  function hideDuplicateError() {
    duplicateError.textContent = "";
    duplicateError.classList.remove("visible");
  }

  /* ==========================================================
     SECTION 5 — TASK CRUD
  ========================================================== */

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function addTask() {
    var text = taskInput.value.trim();

    // Validate: not empty
    if (text === "") {
      showDuplicateError("Please enter a task before adding.");
      taskInput.focus();
      return;
    }

    // Validate: not a duplicate (Challenge C3)
    if (isDuplicate(text)) {
      showDuplicateError("\"" + text + "\" is already in your list.");
      taskInput.focus();
      return;
    }

    hideDuplicateError();

    var newTask = { id: generateId(), text: text, completed: false };
    tasks.push(newTask);
    saveTasks();
    taskInput.value = "";

    renderTasks();
    taskInput.focus();
  }

  function toggleTask(id) {
    tasks = tasks.map(function (task) {
      if (task.id === id) {
        return { id: task.id, text: task.text, completed: !task.completed };
      }
      return task;
    });
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    renderTasks();
  }

  /* ==========================================================
     SECTION 6 — RENDERING
  ========================================================== */

  function getFilteredTasks() {
    if (currentFilter === "active") {
      return tasks.filter(function (t) { return !t.completed; });
    }
    if (currentFilter === "completed") {
      return tasks.filter(function (t) { return t.completed; });
    }
    return tasks; // "all"
  }

  function renderTasks() {
    var filtered = getFilteredTasks();

    // Clear existing list items
    taskList.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.classList.add("visible");
    } else {
      emptyState.classList.remove("visible");
    }

    filtered.forEach(function (task) {
      var li       = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");
      li.setAttribute("data-id", task.id);

      // Checkbox
      var checkbox         = document.createElement("input");
      checkbox.type        = "checkbox";
      checkbox.className   = "task-item__checkbox";
      checkbox.checked     = task.completed;
      checkbox.setAttribute("aria-label", "Mark \"" + task.text + "\" as " +
        (task.completed ? "incomplete" : "complete"));
      checkbox.addEventListener("change", function () {
        toggleTask(task.id);
      });

      // Text
      var span       = document.createElement("span");
      span.className = "task-item__text";
      span.textContent = task.text;

      // Delete button
      var delBtn       = document.createElement("button");
      delBtn.className = "btn btn--danger";
      delBtn.textContent = "✕";
      delBtn.setAttribute("aria-label", "Delete \"" + task.text + "\"");
      delBtn.addEventListener("click", function () {
        deleteTask(task.id);
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      taskList.appendChild(li);
    });

    // Update task counter
    var activeCount = tasks.filter(function (t) { return !t.completed; }).length;
    taskCount.textContent = activeCount + " remaining";
  }

  /* ==========================================================
     SECTION 7 — FILTER BUTTONS
  ========================================================== */

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentFilter = btn.getAttribute("data-filter");

      // Update active class
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      renderTasks();
    });
  });

  /* ==========================================================
     SECTION 8 — ADD TASK EVENT LISTENERS
  ========================================================== */

  addTaskBtn.addEventListener("click", function () {
    addTask();
  });

  taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Hide the error as soon as the user starts typing again
  taskInput.addEventListener("input", function () {
    if (duplicateError.classList.contains("visible")) {
      hideDuplicateError();
    }
  });

  /* ==========================================================
     SECTION 9 — INITIALISATION
  ========================================================== */

  function init() {
    initTheme();      // C1: restore theme preference
    initUserName();   // C2: restore greeting name
    loadTasks();      // MVP: restore persisted tasks
    renderTasks();    // MVP: paint the list
  }

  init();

})(); // end IIFE

/* =============================================================
   ADDITIONS — Edit Task, Quick Links, Focus Timer
   Appended outside the original IIFE so both blocks share
   the global scope of the page. All logic is self-contained.
============================================================= */

(function () {
  "use strict";

  /* ===========================================================
     SECTION A — EDIT TASK (inline editing)
     Modifies renderTasks to inject an Edit button per item,
     and adds the enterEditMode / saveEdit / cancelEdit flow.
     The original renderTasks is replaced by patching the
     global tasks array and re-using saveTasks / loadTasks
     already defined in the first IIFE — we reach them via
     localStorage directly to stay self-contained.
  =========================================================== */

  /* ── helpers that mirror the first IIFE ── */
  function getTasksFromStorage() {
    try {
      var stored = localStorage.getItem("tasks");
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  }

  function saveTasksToStorage(arr) {
    localStorage.setItem("tasks", JSON.stringify(arr));
  }

  /* ── inline-edit entry point ── */
  function enterEditMode(li, task) {
    /* Swap the text span and edit/delete buttons for an input + save/cancel */
    li.innerHTML = "";

    var input = document.createElement("input");
    input.type      = "text";
    input.className = "task-item__edit-input";
    input.value     = task.text;
    input.maxLength = 120;
    input.setAttribute("aria-label", "Edit task");

    var saveBtn   = document.createElement("button");
    saveBtn.className   = "btn btn--save";
    saveBtn.textContent = "✓ Save";
    saveBtn.setAttribute("aria-label", "Save edit");

    var cancelBtn   = document.createElement("button");
    cancelBtn.className   = "btn btn--cancel";
    cancelBtn.textContent = "✕";
    cancelBtn.setAttribute("aria-label", "Cancel edit");

    li.appendChild(input);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
    input.focus();
    /* place cursor at end */
    input.selectionStart = input.selectionEnd = input.value.length;

    /* ── save handler ── */
    function doSave() {
      var newText = input.value.trim();
      if (newText === "") { input.focus(); return; }

      /* duplicate check: exclude the task being edited */
      var others = getTasksFromStorage().filter(function (t) { return t.id !== task.id; });
      var isDup  = others.some(function (t) {
        return t.text.trim().toLowerCase() === newText.toLowerCase();
      });
      if (isDup) {
        input.style.borderColor = "var(--color-danger)";
        input.setAttribute("title", "A task with this name already exists.");
        input.focus();
        return;
      }

      /* persist */
      var all = getTasksFromStorage().map(function (t) {
        return t.id === task.id ? { id: t.id, text: newText, completed: t.completed } : t;
      });
      saveTasksToStorage(all);
      refreshTaskUI();
    }

    saveBtn.addEventListener("click", doSave);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter")  { e.preventDefault(); doSave(); }
      if (e.key === "Escape") { refreshTaskUI(); }
    });
    cancelBtn.addEventListener("click", function () { refreshTaskUI(); });
  }

  /* ── full re-render of the task list (mirrors original renderTasks) ── */
  function refreshTaskUI() {
    var taskListEl  = document.getElementById("task-list");
    var emptyEl     = document.getElementById("empty-state");
    var taskCountEl = document.getElementById("task-count");
    var filterBtns  = document.querySelectorAll(".btn--filter");

    /* find active filter */
    var currentFilter = "all";
    filterBtns.forEach(function (b) {
      if (b.classList.contains("active")) { currentFilter = b.getAttribute("data-filter"); }
    });

    var allTasks = getTasksFromStorage();
    var filtered = allTasks;
    if (currentFilter === "active")    { filtered = allTasks.filter(function (t) { return !t.completed; }); }
    if (currentFilter === "completed") { filtered = allTasks.filter(function (t) { return t.completed;  }); }

    taskListEl.innerHTML = "";
    emptyEl.classList.toggle("visible", filtered.length === 0);

    filtered.forEach(function (task) {
      var li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");
      li.setAttribute("data-id", task.id);

      /* checkbox */
      var checkbox = document.createElement("input");
      checkbox.type      = "checkbox";
      checkbox.className = "task-item__checkbox";
      checkbox.checked   = task.completed;
      checkbox.setAttribute("aria-label",
        "Mark \"" + task.text + "\" as " + (task.completed ? "incomplete" : "complete"));
      checkbox.addEventListener("change", function () {
        var arr = getTasksFromStorage().map(function (t) {
          return t.id === task.id ? { id: t.id, text: t.text, completed: !t.completed } : t;
        });
        saveTasksToStorage(arr);
        refreshTaskUI();
      });

      /* text */
      var span = document.createElement("span");
      span.className   = "task-item__text";
      span.textContent = task.text;

      /* edit button */
      var editBtn = document.createElement("button");
      editBtn.className   = "btn btn--edit";
      editBtn.textContent = "✎";
      editBtn.setAttribute("aria-label", "Edit \"" + task.text + "\"");
      editBtn.addEventListener("click", function () { enterEditMode(li, task); });

      /* delete button */
      var delBtn = document.createElement("button");
      delBtn.className   = "btn btn--danger";
      delBtn.textContent = "✕";
      delBtn.setAttribute("aria-label", "Delete \"" + task.text + "\"");
      delBtn.addEventListener("click", function () {
        var arr = getTasksFromStorage().filter(function (t) { return t.id !== task.id; });
        saveTasksToStorage(arr);
        refreshTaskUI();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);
      taskListEl.appendChild(li);

      /* update counter */
      var activeCount = allTasks.filter(function (t) { return !t.completed; }).length;
      taskCountEl.textContent = activeCount + " remaining";
    });

    /* handle counter when list is empty */
    if (filtered.length === 0) {
      var activeCount = allTasks.filter(function (t) { return !t.completed; }).length;
      taskCountEl.textContent = activeCount + " remaining";
    }
  }

  /* ── override the original add-task listeners to use refreshTaskUI ── */
  /* We piggyback on the original IIFE's add button by adding a second
     listener that fires refreshTaskUI after the original one runs.      */
  var addTaskBtn = document.getElementById("add-task-btn");
  var taskInput  = document.getElementById("task-input");

  function triggerRefresh() {
    /* Slight delay so the original IIFE's saveTasks runs first */
    setTimeout(refreshTaskUI, 0);
  }
  addTaskBtn.addEventListener("click",   triggerRefresh);
  taskInput.addEventListener("keydown",  function (e) { if (e.key === "Enter") triggerRefresh(); });

  /* Also hook filter buttons to use refreshTaskUI */
  document.querySelectorAll(".btn--filter").forEach(function (btn) {
    btn.addEventListener("click", function () { setTimeout(refreshTaskUI, 0); });
  });

  /* Initial render with edit buttons */
  refreshTaskUI();


  /* ===========================================================
     SECTION B — QUICK LINKS
  =========================================================== */

  var linkNameInput  = document.getElementById("link-name-input");
  var linkUrlInput   = document.getElementById("link-url-input");
  var addLinkBtn     = document.getElementById("add-link-btn");
  var linkListEl     = document.getElementById("link-list");
  var linkErrorEl    = document.getElementById("link-error");
  var linkEmptyEl    = document.getElementById("link-empty-state");

  /* ── storage helpers ── */
  function getLinks() {
    try {
      var stored = localStorage.getItem("links");
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  }

  function saveLinks(arr) {
    localStorage.setItem("links", JSON.stringify(arr));
  }

  /* ── error display ── */
  function showLinkError(msg) {
    linkErrorEl.textContent = msg;
    linkErrorEl.classList.add("visible");
  }
  function hideLinkError() {
    linkErrorEl.textContent = "";
    linkErrorEl.classList.remove("visible");
  }

  /* ── URL normalisation ── */
  function normaliseUrl(raw) {
    var trimmed = raw.trim();
    if (trimmed === "") return "";
    if (!/^https?:\/\//i.test(trimmed)) { trimmed = "https://" + trimmed; }
    try { new URL(trimmed); return trimmed; } catch (e) { return ""; }
  }

  /* ── render ── */
  function renderLinks() {
    var links = getLinks();
    linkListEl.innerHTML = "";
    linkEmptyEl.classList.toggle("visible", links.length === 0);

    links.forEach(function (link) {
      var li = document.createElement("li");
      li.className = "link-item";

      var icon = document.createElement("span");
      icon.className   = "link-item__icon";
      icon.textContent = "🔗";
      icon.setAttribute("aria-hidden", "true");

      var info = document.createElement("div");
      info.className = "link-item__info";

      var anchor = document.createElement("a");
      anchor.className = "link-item__anchor";
      anchor.href      = link.url;
      anchor.target    = "_blank";
      anchor.rel       = "noopener noreferrer";
      anchor.textContent = link.name;

      var urlSpan = document.createElement("span");
      urlSpan.className   = "link-item__url";
      urlSpan.textContent = link.url;

      info.appendChild(anchor);
      info.appendChild(urlSpan);

      var delBtn = document.createElement("button");
      delBtn.className   = "btn btn--danger";
      delBtn.textContent = "✕";
      delBtn.setAttribute("aria-label", "Delete link \"" + link.name + "\"");
      delBtn.addEventListener("click", function () {
        var arr = getLinks().filter(function (l) { return l.id !== link.id; });
        saveLinks(arr);
        renderLinks();
      });

      li.appendChild(icon);
      li.appendChild(info);
      li.appendChild(delBtn);
      linkListEl.appendChild(li);
    });
  }

  /* ── add link ── */
  function addLink() {
    var name = linkNameInput.value.trim();
    var url  = normaliseUrl(linkUrlInput.value);

    if (name === "") {
      showLinkError("Please enter a name for the link.");
      linkNameInput.focus();
      return;
    }
    if (url === "") {
      showLinkError("Please enter a valid URL (e.g. https://example.com).");
      linkUrlInput.focus();
      return;
    }

    hideLinkError();
    var links = getLinks();
    links.push({ id: Date.now().toString(36), name: name, url: url });
    saveLinks(links);
    linkNameInput.value = "";
    linkUrlInput.value  = "";
    renderLinks();
    linkNameInput.focus();
  }

  addLinkBtn.addEventListener("click", addLink);
  linkUrlInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addLink();
  });
  linkNameInput.addEventListener("input", hideLinkError);
  linkUrlInput.addEventListener("input",  hideLinkError);

  /* initial render */
  renderLinks();


  /* ===========================================================
     SECTION C — FOCUS TIMER
  =========================================================== */

  var TIMER_TOTAL    = 25 * 60;   /* 25 minutes in seconds */
  var timerRemaining = TIMER_TOTAL;
  var timerInterval  = null;      /* setInterval handle — null when not running */
  var timerRunning   = false;

  var timerDisplay = document.getElementById("timer-display");
  var timerStart   = document.getElementById("timer-start");
  var timerStop    = document.getElementById("timer-stop");
  var timerReset   = document.getElementById("timer-reset");

  /* ── format seconds → MM:SS ── */
  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  /* ── update the display element ── */
  function updateDisplay() {
    timerDisplay.textContent = formatTime(timerRemaining);
  }

  /* ── sync button states ── */
  function syncControls() {
    if (timerRunning) {
      timerStart.disabled = true;
      timerStop.disabled  = false;
      timerDisplay.classList.add("timer--running");
      timerDisplay.classList.remove("timer--finished");
    } else {
      timerStart.disabled = (timerRemaining === 0);
      timerStop.disabled  = true;
      timerDisplay.classList.remove("timer--running");
    }
  }

  /* ── tick ── */
  function tick() {
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning  = false;
      timerRemaining = 0;
      updateDisplay();
      timerDisplay.classList.remove("timer--running");
      timerDisplay.classList.add("timer--finished");
      timerStart.disabled = true;
      timerStop.disabled  = true;
      return;
    }
    timerRemaining -= 1;
    updateDisplay();
  }

  /* ── Start ── */
  timerStart.addEventListener("click", function () {
    if (timerRunning || timerRemaining === 0) return;
    /* Guard: never open a second interval */
    if (timerInterval !== null) { clearInterval(timerInterval); }
    timerRunning  = true;
    timerInterval = setInterval(tick, 1000);
    syncControls();
  });

  /* ── Pause / Stop ── */
  timerStop.addEventListener("click", function () {
    if (!timerRunning) return;
    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning  = false;
    syncControls();
  });

  /* ── Reset ── */
  timerReset.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval  = null;
    timerRunning   = false;
    timerRemaining = TIMER_TOTAL;
    updateDisplay();
    timerDisplay.classList.remove("timer--running", "timer--finished");
    syncControls();
  });

  /* initial state */
  updateDisplay();
  syncControls();

})(); /* end additions IIFE */

/* =============================================================
   SECTION D — GREETING TIME-OF-DAY, CLOCK & DATE
   Requirements:
     • Time-based greeting (morning / afternoon / evening)
     • 24-hour HH:MM:SS clock, updated every second
     • Indonesian date format via Intl.DateTimeFormat
     • Works together with the existing Custom Name feature
============================================================= */

(function () {
  "use strict";

  var greetingPhrase = document.getElementById("greeting-time-of-day");
  var clockTime      = document.getElementById("clock-time");
  var clockDate      = document.getElementById("clock-date");

  /* Indonesian locale date formatter */
  var dateFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric"
  });

  function getGreeting(hour) {
    if (hour >= 5  && hour < 12) { return "Good morning"; }
    if (hour >= 12 && hour < 18) { return "Good afternoon"; }
    return "Good evening";
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function tick() {
    var now  = new Date();
    var h    = now.getHours();
    var m    = now.getMinutes();
    var s    = now.getSeconds();

    /* Update greeting phrase */
    greetingPhrase.textContent = getGreeting(h);

    /* Update clock — HH:MM:SS */
    clockTime.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);

    /* Update date — Indonesian format, e.g. Kamis, 19 November 2026 */
    clockDate.textContent = dateFormatter.format(now);
  }

  /* Run immediately so there is no blank flash on load */
  tick();

  /* Then update every second */
  setInterval(tick, 1000);

})();
