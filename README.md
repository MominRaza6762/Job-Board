# Job Board

A complete Job Board application where job seekers can apply for jobs, employers can post job listings, and admins can manage all aspects of the platform. The app is built using the MERN stack (MongoDB, Express, React, Node.js) and includes JWT authentication, file uploads, and user roles management.

---

## Table of Contents

- [Introduction](#introduction)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

---

## Introduction

The Job Board web application is designed to allow job seekers to search for job opportunities and apply for them. Employers can post job listings, and admins can manage users, job listings, and applications. This app aims to simplify the hiring process by providing a centralized platform for both job seekers and employers.

---

## Live Demo

You can check the live version of the application here:  
[Job Board Live Demo](https://job-board-client-delta.vercel.app/)

For Admin Dashboard sign in with <br>
Username : test@admin.com
Password : 123456 <br>

**Note**: These are **dummy credentials** created solely for testing purposes. They will only work with this demo version of the Job Board application. They are not used in any real applications or production environments.

---

## Tech Stack

- **Frontend**: React, React Router, Axios, Helmet, Toastify
- **Backend**: Node.js, Express, MongoDB, bcryptjs, jsonwebtoken, multer, cloudinary
- **Authentication**: JWT-based authentication
- **File Storage**: Cloudinary (for file uploads)

---

## Features

### Admin Features:

1. **View All Applications**: Admins can view all job applications submitted by users and ensure compliance.
2. **Delete Job Listings**: Admins can remove job listings that are outdated or violate platform guidelines.
3. **Manage User Roles**: Admins can manage user roles (grant/revoke permissions) to control who can post jobs and manage content.

### Employer Features:

1. **Registration & Authentication**: Employers can securely sign up and log in using JWT tokens.
2. **Post Jobs**: Employers can create job listings with detailed information such as title, description, salary, and requirements.
3. **Manage Listings**: Employers can edit or delete their job postings.
4. **View Applications**: Employers can view job applications submitted by job seekers and contact candidates directly.

### Job Seeker Features:

1. **Registration & Authentication**: Job seekers can create an account and securely log in.
2. **Search & Filter Jobs**: Job seekers can search for jobs using various filters such as salary, job type, and location.
3. **Apply for Jobs**: Job seekers can apply for jobs by submitting resumes and cover letters.
4. **View Job Listings**: Job seekers can explore all job listings with detailed information.

---

## Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MominRaza6762/Job-Board.git
   cd Job-Board
2. Install dependencies:

   ```bash
   cd server
   npm install
3. Set up environment variables (.env):
   PORT (server port)

- JWT_SECRET (secret key for JWT)
- CLOUDINARY_URL (Cloudinary URL for image uploads)
- MONGO_URI (MongoDB connection URI)
4. Start the backend server:
   ```bash
   npm start
   
---

## Frontend Setup

1. Navigate to the client folder:
   ```bash
   cd client
2. Install frontend dependencies:
   ```bash
   npm install
3. Update backend API URLs in the frontend (src/api.js) to match your backend.
4. Run the frontend server:
   ```bash
   npm run dev

---

## API Endpoints
**User Authentication:**
- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Login and receive JWT token.
- GET /api/auth/me: Get user information (Private route).

**Job Management:**
- POST /api/jobs: Create a new job (Private route).
- GET /api/jobs: Get all jobs (Public route).
- GET /api/jobs/:id: Get job by ID (Public route).
- PUT /api/jobs/:id: Update job (Private route for owner/admin).
- DELETE /api/jobs/:id: Delete job (Private route for owner/admin).

**Job Applications:**
- POST /api/applications: Apply for a job (Private route).
- GET /api/applications/:id: Get application details (Private route for user/admin).

---

# Usage

**Visit the live demo or host the app locally.**

1. Create an account as either an employer or job seeker.
2. Employers can post jobs, and job seekers can apply for jobs.
3. Admins can manage job listings, user permissions, and applications.
