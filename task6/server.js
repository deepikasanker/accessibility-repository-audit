const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
}

function readTasks() {
  ensureDataFile();

  return JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
  );
}

function writeTasks(tasks) {
  ensureDataFile();

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(tasks, null, 2),
    "utf8"
  );
}

function createId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

/* API Health Check */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CampusTasker API"
  });
});

/* Get all tasks */
app.get("/api/tasks", (req, res) => {
  res.json(readTasks());
});

/* Create a task */
app.post("/api/tasks", (req, res) => {
  const {
    title,
    subject,
    dueDate,
    priority
  } = req.body;

  if (!title || !subject || !dueDate) {
    return res.status(400).json({
      message:
        "Title, subject and due date are required."
    });
  }

  const tasks = readTasks();

  const task = {
    id: createId(),
    title: String(title).trim(),
    subject: String(subject).trim(),
    dueDate: dueDate,
    priority: priority || "Medium",
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);

  writeTasks(tasks);

  res.status(201).json(task);
});

/* Update a task */
app.patch("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();

  const index = tasks.findIndex(
    task => task.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found."
    });
  }

  tasks[index] = {
    ...tasks[index],
    ...req.body,
    id: tasks[index].id
  };

  writeTasks(tasks);

  res.json(tasks[index]);
});

/* Delete a task */
app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();

  const filteredTasks = tasks.filter(
    task => task.id !== req.params.id
  );

  if (filteredTasks.length === tasks.length) {
    return res.status(404).json({
      message: "Task not found."
    });
  }

  writeTasks(filteredTasks);

  res.status(204).send();
});

/* Serve frontend */
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

ensureDataFile();

app.listen(PORT, () => {
  console.log(
    `CampusTasker running on port ${PORT}`
  );
});
