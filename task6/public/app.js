const taskForm =
  document.querySelector("#taskForm");

const taskList =
  document.querySelector("#taskList");

const filter =
  document.querySelector("#filter");

const apiStatus =
  document.querySelector("#apiStatus");

const formMessage =
  document.querySelector("#formMessage");

const totalCount =
  document.querySelector("#totalCount");

const pendingCount =
  document.querySelector("#pendingCount");

const doneCount =
  document.querySelector("#doneCount");

let tasks = [];


/* API Request Helper */
async function request(url, options = {}) {

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {

    const data =
      await response
        .json()
        .catch(() => ({}));

    throw new Error(
      data.message || "Request failed."
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}


/* Update dashboard statistics */
function updateStats() {

  totalCount.textContent =
    tasks.length;

  pendingCount.textContent =
    tasks.filter(
      task => !task.completed
    ).length;

  doneCount.textContent =
    tasks.filter(
      task => task.completed
    ).length;
}


/* Filter tasks */
function filteredTasks() {

  switch (filter.value) {

    case "pending":
      return tasks.filter(
        task => !task.completed
      );

    case "completed":
      return tasks.filter(
        task => task.completed
      );

    case "high":
      return tasks.filter(
        task => task.priority === "High"
      );

    default:
      return tasks;
  }
}


/* Display tasks */
function render() {

  updateStats();

  taskList.replaceChildren();

  const visibleTasks =
    filteredTasks();

  if (visibleTasks.length === 0) {

    const empty =
      document.createElement("p");

    empty.className = "empty";

    empty.textContent =
      "No assignments match this filter.";

    taskList.append(empty);

    return;
  }


  visibleTasks.forEach(task => {

    const article =
      document.createElement("article");

    article.className =
      `task${task.completed ? " completed" : ""}`;


    article.innerHTML = `
      <div class="task-main">

        <h3></h3>

        <div class="task-meta">

          <span class="subject"></span>

          <span>
            Due: ${task.dueDate}
          </span>

          <span class="priority ${task.priority}">
            ${task.priority} priority
          </span>

        </div>

      </div>

      <div class="task-actions">

        <button
          class="secondary complete-btn"
          type="button">

          ${
            task.completed
              ? "Mark pending"
              : "Mark complete"
          }

        </button>

        <button
          class="danger delete-btn"
          type="button">

          Delete

        </button>

      </div>
    `;


    article.querySelector("h3")
      .textContent = task.title;


    article.querySelector(".subject")
      .textContent = task.subject;


    /* Complete / Pending */
    article
      .querySelector(".complete-btn")
      .addEventListener(
        "click",
        async () => {

          try {

            await request(
              `/api/tasks/${task.id}`,
              {
                method: "PATCH",

                body: JSON.stringify({
                  completed:
                    !task.completed
                })
              }
            );

            await loadTasks();

          } catch (error) {

            showMessage(
              error.message,
              true
            );
          }
        }
      );


    /* Delete */
    article
      .querySelector(".delete-btn")
      .addEventListener(
        "click",
        async () => {

          try {

            await request(
              `/api/tasks/${task.id}`,
              {
                method: "DELETE"
              }
            );

            await loadTasks();

          } catch (error) {

            showMessage(
              error.message,
              true
            );
          }
        }
      );


    taskList.append(article);

  });
}


/* Form message */
function showMessage(
  message,
  error = false
) {

  formMessage.textContent =
    message;

  formMessage.classList.toggle(
    "error",
    error
  );
}


/* Load tasks from API */
async function loadTasks() {

  tasks =
    await request("/api/tasks");

  render();
}


/* Check API */
async function checkApi() {

  try {

    await request("/api/health");

    apiStatus.textContent =
      "API connected · data is persisted on the server";

  } catch {

    apiStatus.textContent =
      "API connection unavailable";
  }
}


/* Add new task */
taskForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    showMessage("");

    const formData =
      new FormData(taskForm);

    const payload =
      Object.fromEntries(
        formData.entries()
      );


    try {

      await request(
        "/api/tasks",
        {
          method: "POST",

          body: JSON.stringify(
            payload
          )
        }
      );


      taskForm.reset();

      document.querySelector(
        "#priority"
      ).value = "Medium";


      showMessage(
        "Assignment added successfully."
      );

      await loadTasks();

    } catch (error) {

      showMessage(
        error.message,
        true
      );
    }
  }
);


/* Filter change */
filter.addEventListener(
  "change",
  render
);


/* Start application */
async function init() {

  try {

    await checkApi();

    await loadTasks();

  } catch (error) {

    apiStatus.textContent =
      "Unable to load task data.";

    showMessage(
      error.message,
      true
    );
  }
}

init();
