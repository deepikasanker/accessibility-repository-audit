# Task 6 - CampusTasker Production Capstone

## Project
**CampusTasker** is a full-stack student assignment manager built as the Task 6 production capstone.

It demonstrates:
- Authentication simulation through a student profile badge.
- Interactive dashboard.
- Create, read, update and delete (CRUD) operations.
- Persistent server-side task state using a JSON data file.
- REST API endpoints.
- Responsive production-style UI.
- Loading, success and error states.
- Accessible form labels and keyboard focus states.

## Architecture
```text
task6/
├── package.json
├── server.js
├── data/
│   └── tasks.json
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .gitignore
└── README.md
```

## API endpoints
- `GET /api/health` - health check
- `GET /api/tasks` - list tasks
- `POST /api/tasks` - create a task
- `PATCH /api/tasks/:id` - update a task
- `DELETE /api/tasks/:id` - delete a task

## Run locally
Install Node.js, then:

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Deployment
Deploy the repository as a Node.js web service on a supported hosting platform.

Build/install command:
```text
npm install
```

Start command:
```text
npm start
```

The application uses `process.env.PORT`, so the host can provide its own port.

## Final proof
For the internship submission, provide:
1. Public GitHub repository URL.
2. Live deployed application URL.
3. Screenshots showing the dashboard, creating a task, marking a task complete, filtering and deleting a task.

## Note
The authentication shown in this capstone is intentionally a simulation for a student project. It is not a real identity/authentication system.
