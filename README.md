# Student Record Management System

A responsive CRUD web application for the practical assignment. It uses Node.js, Express, Mongoose, MongoDB, HTML, CSS, and browser JavaScript.

## Features
- Create, list, read-one, update, and delete student records
- Mongoose schema validation and unique email constraint
- API validation/error responses for invalid IDs, missing records, validation errors, and duplicate email
- Browser UI with add/edit/delete actions
- Health endpoint to check server/database status

## Requirements
- Node.js 18 or newer
- MongoDB Atlas account (or local MongoDB)
- npm

## 1. Configure MongoDB

1. In MongoDB Atlas, create a cluster (or use an existing cluster).
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, allow your current IP. For a temporary classroom deployment, Atlas may allow `0.0.0.0/0`; use it only if you understand that it allows connections from all IPs and secure the database with a strong password.
4. Select **Connect → Drivers → Node.js** and copy the connection string.
5. Replace the username/password and database name in the URI. Example:

   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/student_management?retryWrites=true&w=majority`

The application creates the `student_management` database and `students` collection when the first student is inserted. The unique email index is created from the Mongoose schema.

## 2. Run locally

From this project directory:

```bash
npm install
cp .env.example .env
```

Edit `.env` and set your real `MONGODB_URI`. Then:

```bash
npm start
```

Open **http://localhost:3000** in your browser. Check **http://localhost:3000/api/health** for the connection status.

For development with automatic restart:

```bash
npm install --save-dev nodemon
npm run dev
```

## 3. API reference

Base URL: `http://localhost:3000/api/students`

| Method | Path | Description | Success |
|---|---|---|---|
| POST | `/api/students` | Create a student | 201 |
| GET | `/api/students` | List all students | 200 |
| GET | `/api/students/:id` | Get one student | 200 |
| PUT | `/api/students/:id` | Update a student | 200 |
| DELETE | `/api/students/:id` | Delete a student | 200 |
| GET | `/api/health` | Check server/database status | 200 |

### Student JSON

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "course": "Computer Science",
  "year": 3
}
```

### Postman examples

**Create** — `POST http://localhost:3000/api/students`, Body → raw → JSON:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "course": "Computer Science",
  "year": 3
}
```

**Read all** — `GET http://localhost:3000/api/students`

**Read one** — `GET http://localhost:3000/api/students/PASTE_ID_HERE`

**Update** — `PUT http://localhost:3000/api/students/PASTE_ID_HERE`, Body → raw → JSON:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul.updated@example.com",
  "course": "Information Technology",
  "year": 4
}
```

**Delete** — `DELETE http://localhost:3000/api/students/PASTE_ID_HERE`

Use the `_id` returned by POST or GET for the ID in read-one/update/delete.

## 4. Validation and error behavior

- Name: required, 2–80 characters
- Email: required, email format, unique, normalized to lowercase
- Course: required, 2–100 characters
- Year: integer from 1 to 6
- Invalid MongoDB ID: 400
- Student not found: 404
- Duplicate email: 409
- Mongoose validation failure: 400
- Unknown route: 404
- Unexpected server error: 500 (details are logged server-side)

## 5. Deploy to Render

1. Push this project to a GitHub repository. Do not commit `.env`.
2. In Render, create **New → Web Service** and connect the repository.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Add environment variables:
   - `MONGODB_URI` = your Atlas connection URI
   - `NODE_ENV` = `production`
   - `PORT` is supplied by Render automatically; the app uses it.
5. Confirm Atlas Network Access permits Render's outbound connection. For a simple student demo, `0.0.0.0/0` is common but less restrictive access is preferable if your Atlas plan/setup supports stable outbound IPs.
6. Deploy. Open the Render URL; the app serves the frontend and API from the same service.
7. Verify `https://YOUR-RENDER-URL.onrender.com/api/health` and test CRUD endpoints in Postman using that URL.

## 6. Suggested practical test cases

1. Create a valid student → expect 201 and returned `_id`.
2. List students → expect 200 and the created record.
3. Read by returned ID → expect 200.
4. Update course/year → expect 200 and updated document.
5. Delete by ID → expect 200.
6. Read deleted ID → expect 404.
7. Submit malformed email or year outside 1–6 → expect 400.
8. Submit the same email twice → expect 409.
9. Use a malformed ID → expect 400.
10. Request a non-existent route → expect 404.

## Project structure

```text
student-record-management/
├── middleware/
│   └── errorHandler.js
├── models/
│   └── Student.js
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── routes/
│   └── students.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Notes
- Keep your actual `.env` private. Never upload MongoDB credentials to GitHub or include them in screenshots.
- This is a practical/demo CRUD application. It does not include user authentication or role-based access control.
