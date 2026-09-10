PG Dissertation Management System
📌 Overview

The PG Dissertation Management System is a full-stack academic web application designed to manage the complete lifecycle of postgraduate (PG) dissertation projects. The system streamlines proposal submission, supervisor allocation, progress tracking, reviews, and approvals through a structured workflow.

To reduce faculty workload, the system emphasizes status-based reviews and in-app notifications instead of real-time chat, ensuring efficient and traceable communication.

This project is developed as part of a PG dissertation / college full-stack project using modern web technologies and industry-standard version control.Absolutely — here is a **complete, copy-paste-ready README** tailored to your actual project and the performance results you verified. I’ve kept the claims defensible and avoided saying things like “500× faster” or “supports 1,000 users.”


# PG Dissertation Management System

A full-stack academic web application designed to manage the complete lifecycle of postgraduate (PG) dissertation projects. The system centralizes proposal submission, supervisor allocation, document submissions, reviews, progress tracking, feedback, queries, approvals, notifications, and activity tracking.

The application provides dedicated workflows for **Students, Supervisors, and Administrators**, with JWT-based authentication and role-based access control to ensure users can access only the resources permitted for their role.

---

## 📌 Overview

Managing dissertation projects can involve multiple stages, including proposal submission, supervisor assignment, document revisions, reviews, feedback, and final approval. Managing these activities through disconnected processes can make tracking difficult for both students and faculty.

The **PG Dissertation Management System** provides a centralized platform where students can submit and track their dissertation work, supervisors can review and provide feedback, and administrators can manage users, departments, and academic workflows.

The system focuses on structured, status-based workflows and in-app notifications instead of real-time chat, making communication traceable while reducing unnecessary faculty workload.

---

## 🚀 Key Features

### 👨‍🎓 Student Module

- Student registration and authentication
- Submit dissertation proposals
- Upload dissertation documents
- Submit multiple dissertation versions
- Track submission status
- View supervisor feedback
- View marks provided by supervisors
- Raise queries with supervisors
- View query responses
- Receive in-app notifications
- View dissertation progress and review status

### 👨‍🏫 Supervisor Module

- Secure supervisor authentication
- View assigned student submissions
- Review dissertation submissions
- Approve submissions
- Reject submissions
- Request revisions
- Provide feedback and marks
- Respond to student queries
- Track assigned dissertation work
- Receive relevant notifications

### 🛡️ Administrator Module

- Manage students
- Manage supervisors
- Manage administrators
- Manage academic departments
- View dissertation records
- View submission records
- Monitor system activity
- Manage user status and roles
- Access system-wide dissertation information

---

## 🔐 Authentication & Role-Based Access Control

The application uses **JWT-based authentication** and role-based authorization.

### Supported Roles

| Role | Access |
|------|--------|
| Student | Own dissertations and submissions |
| Supervisor | Assigned student submissions |
| Admin | System-wide access |

Student and supervisor requests are automatically filtered using the authenticated user's ID.

For example:

```js
if (role === "student") {
    query.studentId = userId;
}

if (role === "supervisor") {
    query.supervisorId = userId;
}
````

This prevents students from retrieving other students' submissions through the standard submission API and restricts supervisors to their assigned submissions.

---

## 🏗️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Context API
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt / bcryptjs
* Multer
* Mongoose

### Database

* MongoDB
* MongoDB Atlas

### Development Tools

* Git
* GitHub
* Postman
* Visual Studio Code

### Deployment

* Vercel
* Render
* MongoDB Atlas

---

## 🏛️ System Architecture

```text
                         ┌─────────────────────┐
                         │    React Frontend   │
                         │                     │
                         │ React + Vite        │
                         │ Tailwind CSS        │
                         │ React Router        │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js Backend   │
                         │                     │
                         │ Express.js          │
                         │ JWT Authentication  │
                         │ Role Authorization  │
                         │ Business Logic      │
                         └──────────┬──────────┘
                                    │
                                    │ Mongoose
                                    ▼
                         ┌─────────────────────┐
                         │      MongoDB        │
                         │                     │
                         │ Users               │
                         │ Departments         │
                         │ Dissertations       │
                         │ Submissions         │
                         │ Feedback            │
                         │ Notifications       │
                         │ Queries             │
                         │ Activity Logs       │
                         └─────────────────────┘
```

---

## 🔄 Dissertation Workflow

```text
                    Student
                       │
                       ▼
              Submit Dissertation
                       │
                       ▼
              Supervisor Allocation
                       │
                       ▼
              Document Submission
                       │
                       ▼
              Supervisor Review
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
         Approve    Reject    Revision
                                  │
                                  ▼
                         Updated Submission
                                  │
                                  ▼
                           Final Review
                                  │
                                  ▼
                              Approval
```

---

## 📄 Submission Versioning

The system maintains submission versions instead of overwriting previous submissions.

Example:

```text
Dissertation
    │
    ├── Submission v1
    │
    ├── Submission v2
    │
    └── Submission v3
```

Each submission stores information such as:

* Dissertation
* Student
* Supervisor
* Title
* Abstract
* Department
* Uploaded document
* Version
* Submission mode
* Status
* Review information
* Submission timestamp

This provides a traceable history of dissertation submissions and revisions.

---

## 🔔 In-App Notifications

The system uses in-app notifications to keep users informed about important activities.

Examples include:

* New submission
* Review status
* Revision request
* Approval
* Feedback
* Query responses

The notification system stores whether a notification has been read, allowing users to track pending notifications.

---

## 💬 Query Management

Students can raise academic queries through the system.

The query workflow supports:

```text
Student
   │
   ▼
Create Query
   │
   ▼
Supervisor Response
   │
   ▼
Query Status Update
```

Supported query statuses:

* Open
* Pending
* Closed

This provides a structured alternative to informal communication for dissertation-related questions.

---

## 📝 Feedback & Review

Supervisors can review student submissions and provide:

* Review comments
* Marks
* Approval status
* Revision requests

Submission statuses include:

```text
Pending
Approved
Rejected
Revision
```

This creates a structured review workflow between students and supervisors.

---

## 📊 Activity Logging

The system maintains activity logs for important user actions.

Tracked activities include:

* Login
* Logout
* Submission
* Review
* Create
* Update
* Delete
* Other system activities

Activity records can contain:

* User
* Activity type
* Action
* Status
* IP address
* User agent
* Additional details
* Timestamp

This improves traceability of important system operations.

---

# ⚡ Performance Testing & Optimization

The application was tested using a synthetic dataset created specifically for performance benchmarking.

### Test Dataset

```text
Students          : 500
Supervisors       : 50
Administrators    : 5
Departments       : 10
Dissertations     : 500
Submissions       : 1,500
```

The performance tests were executed against a separate MongoDB Atlas test database to avoid affecting application data.

---

## 🔥 Authentication Load Test

The authentication API was tested with **1,000 concurrent requests**.

### Result

```text
Total Requests       : 1,000
Successful Requests  : 1,000
HTTP Errors          : 0
Connection Errors    : 0
Success Rate         : 100%
```

The test demonstrates that the authentication API successfully processed the tested concurrent request load in the local + MongoDB Atlas Free environment.

> Note: This is a benchmark result from the test environment and should not be interpreted as production capacity for 1,000 users.

---

# 🗄️ MongoDB Query Optimization

Initial query-plan analysis showed that submission retrieval was performing a collection scan.

### Before Optimization

For a student with 3 submissions:

```text
Documents Returned  : 3
Documents Examined  : 1,500
Keys Examined       : 0
Query Stage         : COLLSCAN
```

MongoDB was examining all 1,500 submission documents to find the 3 records belonging to the student.

A compound index was added:

```js
{
    studentId: 1,
    createdAt: -1
}
```

### After Optimization

```text
Documents Returned  : 3
Documents Examined  : 3
Keys Examined       : 3
Query Stage         : IXSCAN
```

This reduced the number of documents examined from:

```text
1,500 → 3
```

which is a **500× reduction in documents examined**.

---

## 👨‍🏫 Supervisor Query Optimization

The supervisor submission query initially performed:

```text
COLLSCAN
   ↓
SORT
```

For a supervisor with 30 assigned submissions:

```text
Documents Returned  : 30
Documents Examined  : 1,500
Keys Examined       : 0
```

A compound index was added:

```js
{
    supervisorId: 1,
    createdAt: -1
}
```

After optimization:

```text
Documents Returned  : 30
Documents Examined  : 30
Keys Examined       : 30
Query Stage         : IXSCAN
```

This reduced documents examined from:

```text
1,500 → 30
```

which is a **50× reduction in documents examined**.

The index also eliminates the need for a separate sort stage because the index follows the required `createdAt` ordering.

---

# 📈 API Performance Benchmark

The student submission API was benchmarked using 50 sequential requests.

### Before MongoDB Index Optimization

```text
Requests        : 50
Successful      : 50
Failed          : 0
Average         : 170.67 ms
P95             : 451.49 ms
Minimum         : 81.89 ms
Maximum         : 852.96 ms
```

### After MongoDB Index Optimization

```text
Requests        : 50
Successful      : 50
Failed          : 0
Average         : 137.70 ms
P95             : 348.68 ms
Minimum         : 87.48 ms
Maximum         : 383.99 ms
```

### Improvement

```text
Average latency : ~19% lower
P95 latency     : ~23% lower
```

The optimization improved both average and tail API latency in the benchmark.

---

# 🧪 Performance Testing Scripts

Performance and database testing scripts are available in:

```text
server/scripts/
```

The scripts cover:

* Authentication benchmarking
* Concurrent authentication testing
* Dissertation API benchmarking
* Submission API benchmarking
* MongoDB query-plan analysis
* Student submission query optimization
* Supervisor submission query optimization
* Concurrent API request testing

Example scripts:

```text
server/
└── scripts/
    ├── benchmarkauth.js
    ├── benchmarkdissertations.js
    ├── benchmarksubmissions.js
    ├── dissertationqueryplan.js
    ├── submissionqueryplan.js
    ├── supervisorqueryplan.js
    ├── addsupervisorindex.js
    └── ...
```

---

# 🗃️ Database Models

The backend uses Mongoose models for the following entities:

```text
User
Department
Dissertation
Submission
Feedback
Notification
Query
ActivityLog
```

### User

Stores:

* Name
* Email
* Password
* Role
* Department
* Roll number
* Batch
* Program
* Phone number
* Designation
* Active status

### Department

Stores:

* Department name
* Department code

### Dissertation

Stores:

* Student
* Title
* Abstract
* Department
* Status

### Submission

Stores:

* Dissertation
* Student
* Supervisor
* Title
* Abstract
* Department
* Uploaded document
* Version
* Submission mode
* Status
* Review timestamp

### Feedback

Stores:

* Dissertation submission
* Supervisor
* Student
* Comments
* Marks

### Notification

Stores:

* User
* Message
* Read status

### Query

Stores:

* Student
* Supervisor
* Subject
* Question
* Response
* Status

### ActivityLog

Stores:

* User
* Activity type
* Action
* Status
* IP address
* User agent
* Details
* Timestamp

---

# 📁 Project Structure

```text
PG-Dissertation-Management/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   │
│   ├── scripts/
│   │   ├── benchmarkauth.js
│   │   ├── benchmarkdissertations.js
│   │   ├── benchmarksubmissions.js
│   │   ├── dissertationqueryplan.js
│   │   ├── submissionqueryplan.js
│   │   ├── supervisorqueryplan.js
│   │   └── ...
│   │
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 🔌 API Endpoints

### Authentication

```text
POST /api/auth/login
```

Used for user authentication and JWT generation.

### Users

```text
/api/users
```

User management endpoints.

### Departments

```text
/api/departments
```

Department management endpoints.

### Dissertations

```text
/api/dissertations
```

Dissertation creation, retrieval, and management.

### Submissions

```text
POST /api/submissions
GET  /api/submissions
PUT  /api/submissions/:id/review
```

Used for dissertation document submission and supervisor review.

### Feedback

```text
/api/feedback
```

Feedback and marks management.

### Queries

```text
/api/queries
```

Student-supervisor query management.

### Notifications

```text
/api/notifications
```

In-app notification management.

### Activity Logs

```text
/api/activity-logs
```

System activity tracking.

---

# 🔒 Security

The application implements several security mechanisms:

* JWT-based authentication
* Password hashing
* Protected API routes
* Role-based authorization
* User-scoped database queries
* File upload handling
* Activity logging
* Environment-based configuration

Sensitive configuration such as:

```text
MONGO_URI
JWT_SECRET
API keys
```

should be stored in environment variables and must not be committed to GitHub.

---

# ⚙️ Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit the actual `.env` file.

Recommended `.gitignore` entries:

```gitignore
node_modules/
.env
.env.*
!.env.example
```

---

# 🛠️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Sashank206/PG-Dissertation-Management.git
```

```bash
cd PG-Dissertation-Management
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Configure Environment Variables

Create:

```text
server/.env
```

and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 4. Start Backend

```bash
node server.js
```

For development, use the appropriate development command configured in the project.

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

---

## 6. Start Frontend

```bash
npm run dev
```

The frontend will be available through the Vite development server.

---

# 🧪 Testing

The application can be tested using:

* Postman
* Browser
* Performance benchmark scripts
* MongoDB query-plan analysis

Example:

```bash
cd server
node scripts/benchmarksubmissions.js
```

Performance scripts should be executed against the dedicated test database rather than production/application data.

---

# 🎯 Project Objectives

The major objectives of the project are:

1. Centralize dissertation management.
2. Simplify dissertation submission and tracking.
3. Provide structured supervisor review workflows.
4. Maintain submission version history.
5. Reduce dependency on fragmented communication channels.
6. Provide role-specific access to academic information.
7. Improve traceability through activity logging.
8. Improve database query efficiency through appropriate indexing.
9. Provide measurable performance testing using synthetic workloads.

---

# 📌 Key Engineering Highlights

* Built a complete MERN stack application.
* Implemented JWT authentication and role-based authorization.
* Designed RESTful backend APIs.
* Implemented dissertation submission versioning.
* Added supervisor review and feedback workflows.
* Implemented in-app notification functionality.
* Added activity logging for traceability.
* Created synthetic datasets for performance testing.
* Load-tested authentication with 1,000 concurrent requests.
* Analyzed MongoDB execution plans using `executionStats`.
* Added compound indexes for student and supervisor submission retrieval.
* Reduced documents examined by up to **500×** for indexed queries.
* Improved student submission API average latency by approximately **19%** in benchmark testing.

---

# 🚧 Future Enhancements

Possible future improvements include:

* Advanced dissertation analytics
* Email notifications
* Calendar and milestone integration
* Automated plagiarism-check integration
* Advanced search and filtering
* Dashboard analytics
* Cloud-based document storage
* Automated testing and CI/CD pipelines
* More comprehensive API monitoring
* Fine-grained permissions for additional academic workflows

---

# 📚 Learning Outcomes

Through this project, the following areas were explored:

* Full-stack web development
* REST API design
* MongoDB data modeling
* Mongoose
* JWT authentication
* Role-based authorization
* File upload handling
* Database indexing
* Query optimization
* API performance benchmarking
* Concurrent request testing
* Git and GitHub workflow
* Deployment of full-stack applications

---

# 👨‍💻 Author

## Sashank

B.Tech Computer Science & Engineering

GitHub:

[https://github.com/Sashank206](https://github.com/Sashank206)

---

# ⭐ Project Highlights

```text
MERN Stack
JWT Authentication
Role-Based Access Control
REST APIs
MongoDB
Submission Versioning
Supervisor Reviews
In-App Notifications
Activity Logging
Performance Benchmarking
MongoDB Query Optimization
```

> This project was developed as an academic full-stack application with a focus on practical software engineering, security, database optimization, and measurable performance testing.

```
