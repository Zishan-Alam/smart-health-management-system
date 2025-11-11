# 🏥 Smart Health Management System

The **Smart Health Management System (SHMS)** is a web-based platform designed to make hospital and clinic management more efficient.  
It connects **patients**, **doctors**, and **administrators** on a single platform to handle **appointments, health records, and billing** digitally.

---

## 🚀 Overview

This system replaces manual hospital operations with an online solution for:
- Booking doctor appointments  
- Managing electronic health records  
- Generating and tracking patient bills  
- Providing admin-level control and analytics  

It ensures secure data handling, role-based access, and smooth usability for all users.

---

## 🧰 Tech Stack

**Frontend:**  
- Next.js (React Framework)  
- Tailwind CSS (for responsive UI)  
- Framer Motion (for animations)

**Backend:**  
- Supabase (PostgreSQL + Authentication + API)

**Deployment:**  
- Lovable / Vercel  

---

## 👥 User Roles

| Role | Description |
|------|--------------|
| 👤 **Patient** | Book appointments, view health records, and check bills. |
| 🧑‍⚕️ **Doctor** | Manage appointments, update patient records, and mark visits as completed. |
| 🧑‍💼 **Admin** | Oversee users, appointments, and billing data; ensure system management. |

---

## ⚙️ Core Functionalities

### 🔐 Authentication
- Secure login/signup with Supabase Auth  
- Role-based redirection to dashboards (Patient, Doctor, Admin)

### 📅 Appointment Booking
- Patients book appointments with available doctors  
- Doctors view, update, and complete appointments  
- Admins can view all hospital appointments

### 🩺 Electronic Health Records (EHR)
- Doctors create and update patient records  
- Patients can view their diagnosis and treatment history  
- All data stored securely in Supabase

### 💰 Billing System
- Bills are auto-generated when consultations are completed  
- Patients can view and download bills  
- Admin tracks payment status and financial summaries

### 🧑‍💼 Admin Dashboard
- Full visibility over hospital data  
- Manage users, appointments, and billing  
- Generate insights and maintain system integrity

---

## 💡 Key Features

- 🧩 **Full CRUD operations** with Supabase  
- 📱 **Fully responsive design** (works on mobile, tablet, and desktop)  
- ☁️ **Cloud-based database** for real-time data sync  
- 🔒 **Secure role-based access control**  
- 📊 **Clean and intuitive dashboards** for all users  

---

## 🔒 Security

- All user data stored in Supabase (PostgreSQL)  
- Row-Level Security (RLS) ensures users only see their relevant data  
- Admins have complete monitoring access  

---

## 🧠 In Simple Words

The system acts like a **digital hospital assistant** —  
patients book and track visits, doctors manage records, and admins monitor everything from one place.  
It makes healthcare **faster, organized, and paperless**.

---

## 📜 License
This project was built as part of the **SEN6000 – Advanced Programming Module** at Cardiff Metropolitan University.

---
