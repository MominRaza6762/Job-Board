# Job Board Web Application

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
- [License](#license)
- [Screenshots](#screenshots)

---

## Introduction

The Job Board web application is designed to allow job seekers to search for job opportunities and apply for them. Employers can post job listings, and admins can manage users, job listings, and applications. This app aims to simplify the hiring process by providing a centralized platform for both job seekers and employers.

---

## Live Demo

You can check the live version of the application here:  
[Job Board Live Demo](https://job-board-client-delta.vercel.app/)

---

## Tech Stack

- **Frontend**: React, React Router, Axios, Helmet, Toastify
- **Backend**: Node.js, Express, MongoDB, bcryptjs, jsonwebtoken, multer, cloudinary
- **Authentication**: JWT-based authentication
- **File Storage**: Cloudinary (for file uploads)

---

## Features

### Admin Features:

1. **Approve Job Listings**: Admins can review job postings and approve or reject them before they are visible to the public.
2. **Delete Job Listings**: Admins can remove job listings that are outdated or violate platform guidelines.
3. **View All Applications**: Admins can view all job applications submitted by users and ensure compliance.
4. **Manage User Roles**: Admins can manage user roles (grant/revoke permissions) to control who can post jobs and manage content.

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
