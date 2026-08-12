# NEUZEN AI - Full Stack HRMS Portal

A comprehensive Human Resource Management System built for the NEUZEN AI technical assessment.

## 🚀 Tech Stack
- **Frontend:** React.js, Tailwind CSS (v4), Lucide React (Icons), FullCalendar.
- **Backend:** Node.js, Express.js.
- **Database:** Local JSON Persistent Storage (db.json).
- **Authentication:** JWT (JSON Web Tokens) & BcryptJS.

## 🔑 Test Accounts
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@neuzen.ai | password123 |
| **HR** | hr@neuzen.ai | password123 |
| **Employee** | employee@neuzen.ai | password123 |

## ✨ Core Features
- **RBAC:** Secure routing for Admin, HR, and Employee.
- **Onboarding:** Digital Offer Letter generation with live preview.
- **Attendance:** Daily Clock-in/Clock-out tracking.
- **Leave Management:** Full workflow from request to HR approval.
- **Payroll:** Monthly salary breakdown and pay slip view.
- **Calendar:** Interactive team schedule using FullCalendar.

## 🛠️ Local Setup
1. Clone the repository.
2. **Backend:** 
   - `cd backend`
   - `npm install`
   - `node server.js`
3. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`