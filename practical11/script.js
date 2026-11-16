// Study Planner: all of the page's JavaScript lives in this one file.
//
//   Part 1  Class scheduler  (setInterval, setTimeout)   -> export initScheduler()
//   Part 2  Task tracker     (jQuery, storage, AJAX)     -> export initTaskTracker()
//
// This file is an ES6 module. index.html imports the two exported functions
// and calls them; everything else here is private to the module.

/* ================================================================
   Shared helpers (private to this module)
================================================================ */

const byId = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");

// 3725000 ms -> "01:02:05"
function formatDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// Date -> "18:35:07"
function formatClock(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Date -> "Sunday, 1 Nov 2026"
function formatDate(date) {
    return date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// "14:30" + a base date -> a Date on that day at 14:30:00
function atTime(timeStr, base = new Date()) {
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date(base);
    d.setHours(h, m, 0, 0);
    return d;
}

// 1500 seconds -> "25:00"
function formatMMSS(seconds) {
    const s = Math.max(0, seconds);
    return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

// small pop-up message that removes itself (uses setTimeout)
function showToast(message) {
    let root = byId("toastRoot");

    if (!root) {
        root = document.createElement("div");
        root.id = "toastRoot";
        root.setAttribute("role", "status");
        root.setAttribute("aria-live", "polite");
        document.body.appendChild(root);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    root.appendChild(toast);

    // fade out after 4 seconds, then remove from the DOM
    setTimeout(() => toast.classList.add("hide"), 4000);
    setTimeout(() => toast.remove(), 4400);
}

/* ================================================================
   Part 1: Class scheduler
================================================================ */

// The daily timetable (keep it sorted by start time)
const classes = [
    { name: "JavaScript Lab",    room: "Lab 3",    start: "09:00", end: "10:30" },
    { name: "Data Structures",   room: "Room 204", start: "10:45", end: "11:45" },
    { name: "Database Systems",  room: "Room 108", start: "12:00", end: "13:00" },
    { name: "Computer Networks", room: "Room 301", start: "14:00", end: "15:00" },
    { name: "Web Technologies",  room: "Room 210", start: "15:15", end: "16:15" }
];

// "done" | "live" | "upcoming" for a class at a given moment
function getStatus(cls, now = new Date()) {
    const start = atTime(cls.start, now);
    const end = atTime(cls.end, now);

    if (now >= end) return "done";
    if (now >= start) return "live";
    return "upcoming";
}

// The next class that has not started yet.
// If today's classes are over, it is the first class tomorrow.
function getNextClass(now = new Date()) {
    for (const cls of classes) {
        const start = atTime(cls.start, now);
        if (start > now) {
            return { cls, start, tomorrow: false };
        }
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
        cls: classes[0],
        start: atTime(classes[0].start, tomorrow),
        tomorrow: true
    };
}

// A pausable countdown built on setInterval.
// It compares against a fixed end time instead of subtracting 1 each tick,
// so the display stays correct even if the browser throttles the tab.
class FocusTimer {
    constructor({ onTick, onFinish }) {
        this.onTick = onTick;
        this.onFinish = onFinish;
        this.total = 0;       // seconds the session was set to
        this.remaining = 0;   // seconds left
        this.id = null;       // setInterval id (null when not running)
    }

    get running() {
        return this.id !== null;
    }

    set(minutes) {
        this.stop();
        this.total = minutes * 60;
        this.remaining = this.total;
        this.onTick(this.remaining);
    }

    start() {
        if (this.running || this.remaining <= 0) return;

        const endAt = Date.now() + this.remaining * 1000;

        this.id = setInterval(() => {
            this.remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
            this.onTick(this.remaining);

            if (this.remaining === 0) {
                this.stop();
                this.onFinish();
            }
        }, 250);
    }

    stop() {
        clearInterval(this.id);
        this.id = null;
    }
}

export function initScheduler() {

    /* ---------- Timetable list ---------- */

    let lastSignature = "";

    function renderClassList(now) {
        const statuses = classes.map((cls) => getStatus(cls, now));

        // only rebuild the list when some class changes status
        const signature = statuses.join("|");
        if (signature === lastSignature) return;
        lastSignature = signature;

        const labels = { done: "Completed", live: "Ongoing", upcoming: "Upcoming" };
        const list = byId("classList");
        list.innerHTML = "";

        classes.forEach((cls, i) => {
            const status = statuses[i];

            const li = document.createElement("li");
            li.className = `class-item ${status}`;

            const time = document.createElement("span");
            time.className = "time";
            time.textContent = `${cls.start} - ${cls.end}`;

            const info = document.createElement("div");
            info.className = "info";
            const name = document.createElement("b");
            name.textContent = cls.name;
            const room = document.createElement("span");
            room.textContent = cls.room;
            info.append(name, room);

            const badge = document.createElement("span");
            badge.className = `badge ${status}`;
            badge.textContent = labels[status];

            li.append(time, info, badge);
            list.appendChild(li);
        });
    }

    /* ---------- Live clock + next-class countdown (setInterval) ---------- */

    let announced = "";

    function tick() {
        const now = new Date();

        byId("clock").textContent = formatClock(now);
        byId("date").textContent = formatDate(now);

        const { cls, start, tomorrow } = getNextClass(now);
        const diff = start - now;

        byId("nextCountdown").textContent = formatDuration(diff);
        byId("nextName").textContent = cls.name;
        byId("nextNote").textContent =
            `${cls.room} · ${tomorrow ? "tomorrow" : "today"} at ${cls.start}`;

        renderClassList(now);

        // one heads-up toast when a class is 15 minutes or less away
        const key = `${cls.name}-${start.toDateString()}`;
        if (diff <= 15 * 60 * 1000 && announced !== key) {
            announced = key;
            showToast(`${cls.name} starts in ${Math.ceil(diff / 60000)} min (${cls.room}).`);
        }
    }

    tick();
    setInterval(tick, 1000);

    /* ---------- Focus timer ---------- */

    const display = byId("timerDisplay");
    const startBtn = byId("timerStart");
    const minutesInput = byId("timerMinutes");

    function readMinutes() {
        let m = parseInt(minutesInput.value, 10);
        if (isNaN(m)) m = 25;
        m = Math.min(180, Math.max(1, m));
        minutesInput.value = m;
        return m;
    }

    const timer = new FocusTimer({
        onTick: (seconds) => {
            display.textContent = formatMMSS(seconds);
        },
        onFinish: () => {
            startBtn.textContent = "Start";
            showToast("Focus session complete. Take a short break.");
        }
    });

    timer.set(readMinutes());

    startBtn.addEventListener("click", () => {
        if (timer.running) {
            timer.stop();
            startBtn.textContent = "Resume";
            return;
        }

        if (timer.remaining <= 0) timer.set(readMinutes());
        timer.start();
        startBtn.textContent = "Pause";
    });

    byId("timerReset").addEventListener("click", () => {
        timer.set(readMinutes());
        startBtn.textContent = "Start";
    });

    minutesInput.addEventListener("change", () => {
        if (timer.running) return;
        timer.set(readMinutes());
        startBtn.textContent = "Start";
    });
}

/* ================================================================
   Part 2: Task tracker (jQuery)
   DOM manipulation + events + localStorage/sessionStorage + AJAX
================================================================ */

const TASKS_KEY = "studyPlanner.tasks";   // localStorage  (kept between visits)
const FILTER_KEY = "studyPlanner.filter"; // sessionStorage (kept for this tab only)
const MAX_LEN = 60;

// Data that the AJAX button loads
const SUGGESTIONS = [
    { text: "Revise ES6 modules (import/export)" },
    { text: "Practice fetch() and Promises" },
    { text: "Review jQuery selectors and events" },
    { text: "Solve 3 array method problems" },
    { text: "Read about localStorage vs sessionStorage" }
];

// Where the AJAX request goes. To keep the project to three files, the JSON
// above is sent as a data: URL. Replace this with a file path or API URL
// (e.g. "suggestions.json") to load the same kind of data from a server.
function suggestionsUrl() {
    return "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(SUGGESTIONS));
}

export function initTaskTracker() {

    let tasks = loadTasks();
    let filter = loadFilter();
    let msgTimer = null;

    /* ---------- Storage ---------- */

    function loadTasks() {
        try {
            const raw = localStorage.getItem(TASKS_KEY);

            // first visit: start with a few example tasks
            if (raw === null) {
                return [
                    { id: 1, text: "Finish JavaScript lab record", done: false },
                    { id: 2, text: "Revise array methods", done: false },
                    { id: 3, text: "Prepare for viva", done: false }
                ];
            }

            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function loadFilter() {
        try {
            const saved = sessionStorage.getItem(FILTER_KEY);
            return ["all", "pending", "done"].includes(saved) ? saved : "all";
        } catch (e) {
            return "all";
        }
    }

    function persist() {
        try {
            localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        } catch (e) {
            flash("Storage is unavailable, so changes will not be saved.", "error");
        }
    }

    /* ---------- Helpers ---------- */

    function nextId() {
        return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    }

    function hasTask(text) {
        return tasks.some((t) => t.text.toLowerCase() === text.toLowerCase());
    }

    // short status message under the input
    function flash(message, type) {
        clearTimeout(msgTimer);
        $("#appMsg").text(message).attr("class", type || "ok");

        msgTimer = setTimeout(function () {
            $("#appMsg").text("").attr("class", "");
        }, 2800);
    }

    /* ---------- Rendering ---------- */

    function render() {
        const $list = $("#taskList").empty();

        const visible = tasks.filter(function (t) {
            if (filter === "done") return t.done;
            if (filter === "pending") return !t.done;
            return true;
        });

        if (visible.length === 0) {
            const emptyText = {
                all: "No tasks yet. Add one above.",
                pending: "Nothing pending. Nice work.",
                done: "No completed tasks yet."
            }[filter];

            $list.append($("<li>").addClass("empty").text(emptyText));
        }

        visible.forEach(function (t) {
            const $li = $("<li>")
                .addClass("task")
                .toggleClass("done", t.done)
                .attr("data-id", t.id);

            const $check = $("<input>")
                .attr({ type: "checkbox", "aria-label": "Mark task done" })
                .addClass("check")
                .prop("checked", t.done);

            const $text = $("<span>").addClass("text").text(t.text);

            const $del = $("<button>")
                .attr({ type: "button", "aria-label": "Delete task", title: "Delete" })
                .addClass("del")
                .html("&times;");

            $li.append($check, $text, $del);
            $list.append($li);
        });

        updateStats();
    }

    function updateStats() {
        const total = tasks.length;
        const done = tasks.filter((t) => t.done).length;
        const pct = total ? Math.round((done / total) * 100) : 0;

        $("#statTotal").text(total);
        $("#statDone").text(done);
        $("#statPending").text(total - done);

        $("#progressBar").css("width", pct + "%");
        $(".progress").attr({
            role: "progressbar",
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": pct
        });
    }

    function setActiveChip() {
        $(".chip").each(function () {
            $(this).toggleClass("active", $(this).data("filter") === filter);
        });
    }

    /* ---------- Events ---------- */

    // character counter (input event)
    $("#taskInput").on("input", function () {
        $("#charCount").text(this.value.length + " / " + MAX_LEN);
    });

    // add a task (submit event)
    $("#taskForm").on("submit", function (e) {
        e.preventDefault();

        const text = $("#taskInput").val().trim();

        if (text === "") {
            flash("Type a task first.", "error");
            return;
        }
        if (hasTask(text)) {
            flash("That task is already on the list.", "error");
            return;
        }

        tasks.push({ id: nextId(), text: text, done: false });
        persist();
        render();

        $("#taskInput").val("").trigger("input").trigger("focus");
        flash("Task added.");
    });

    // The list is rebuilt often, so these use event delegation:
    // one listener on #taskList handles every current and future task.

    // tick / untick (change event)
    $("#taskList").on("change", ".check", function () {
        const id = Number($(this).closest(".task").data("id"));
        const task = tasks.find((t) => t.id === id);

        task.done = this.checked;
        persist();
        render();
    });

    // delete (click event)
    $("#taskList").on("click", ".del", function () {
        const $li = $(this).closest(".task");
        const id = Number($li.data("id"));

        $li.slideUp(150, function () {
            tasks = tasks.filter((t) => t.id !== id);
            persist();
            render();
        });
    });

    // edit in place (dblclick event): Enter saves, Esc cancels
    $("#taskList").on("dblclick", ".text", function () {
        const $text = $(this);
        const id = Number($text.closest(".task").data("id"));
        const task = tasks.find((t) => t.id === id);

        const $input = $("<input>")
            .attr({ type: "text", maxlength: MAX_LEN })
            .addClass("edit")
            .val(task.text);

        $text.replaceWith($input);
        $input.trigger("focus")[0].select();

        let finished = false;

        function finish(save) {
            if (finished) return;
            finished = true;

            const value = $input.val().trim();
            if (save && value !== "") task.text = value;

            persist();
            render();
        }

        $input.on("keydown", function (e) {
            if (e.key === "Enter") finish(true);
            else if (e.key === "Escape") finish(false);
        });
        $input.on("blur", function () {
            finish(true);
        });
    });

    // filter chips (click event) + remember the choice for this tab
    $(".filters").on("click", ".chip", function () {
        filter = $(this).data("filter");

        try {
            sessionStorage.setItem(FILTER_KEY, filter);
        } catch (e) { /* ignore */ }

        setActiveChip();
        render();
    });

    // remove all completed tasks
    $("#clearDone").on("click", function () {
        const before = tasks.length;
        tasks = tasks.filter((t) => !t.done);

        if (tasks.length === before) {
            flash("No completed tasks to clear.", "error");
            return;
        }

        persist();
        render();
        flash("Completed tasks cleared.");
    });

    /* ---------- AJAX ---------- */

    // load suggested tasks with $.getJSON, without reloading the page
    $("#loadSuggestions").on("click", function () {
        const $btn = $(this);
        const label = $btn.text();

        $btn.prop("disabled", true).text("Loading...");

        $.getJSON(suggestionsUrl())
            .done(function (data) {
                let added = 0;

                (Array.isArray(data) ? data : []).forEach(function (item) {
                    if (item.text && !hasTask(item.text)) {
                        tasks.push({ id: nextId(), text: item.text, done: false });
                        added++;
                    }
                });

                persist();
                render();

                flash(added
                    ? "Added " + added + " suggested task" + (added > 1 ? "s" : "") + "."
                    : "All suggestions are already on your list.");
            })
            .fail(function () {
                flash("Could not load suggestions.", "error");
            })
            .always(function () {
                $btn.prop("disabled", false).text(label);
            });
    });

    /* ---------- Start ---------- */

    setActiveChip();
    render();
}
