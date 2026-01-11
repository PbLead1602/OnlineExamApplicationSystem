#  Online Exam Management System (Node.js + React + MySQL)

A full-stack **Online Examination Management System** designed to simplify exam creation, subject management, and student participation.  
Built using **Node.js (Express)**, **React.js**, and **MySQL**, with secure JWT-based authentication and role-based access control.

---

##  Tech Stack
**Frontend:** React.js, Bootstrap, Axios  
**Backend:** Node.js, Express.js, MySQL  
**Authentication:** JWT (JSON Web Token)  
**Database:** MySQL  
**Version Control:** Git & GitHub  

---

##  Key Features (Implemented )
###  Admin
- Register & login with secure JWT authentication  
- Manage subjects (Add, Update, Delete)  
- Manage questions (Add, View, Search)  
- Manage exams linked with subjects  
- Role-based access control (Admin/Student)

###  Student
- Register & login  
- View available exams  
- Take exams (module in progress )

---

##  Modules Under Development
- Edit & Delete Questions  
- Exam Attempt / Result Tracking  
- Advanced Student Dashboard & Reports  

---

##  Folder Structure

ONLINEEXAM/
├── backend/
│ ├── controllers/
│ │ ├── passwordController.js
│ │ ├── questionController.js
│ │ ├── subjectController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ ├── errorMiddleware.js
│ ├── models/
│ │ ├── contactModel.js
│ │ ├── Exam.js
│ │ ├── Question.js
│ │ ├── Subject.js
│ │ ├── userModel.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── contactRoutes.js
│ │ ├── examRoutes.js
│ │ ├── passwordRoutes.js
│ │ ├── questionRoutes.js
│ │ ├── subjectRoutes.js
│ ├── index.js
│ ├── package.json
│ └── package-lock.json
├── frontend/
│ ├── node_modules/
│ ├── public/
│ │ ├── assets/
│ │ │ ├── logo.jpg
│ │ │ ├── favicon.ico
│ │ │ ├── logo192.png
│ │ │ ├── logo512.png
│ │ ├── index.html
│ │ ├── manifest.json
│ │ ├── robots.txt
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── pages/
│ │ │ ├── AboutPage.js
│ │ │ ├── AdminDashboard.js
│ │ │ ├── AdminProfile.js
│ │ │ ├── AdminSettings.js
│ │ │ ├── AdminSubjects.js
│ │ │ ├── Auth.css
│ │ │ ├── ContactPage.js
│ │ │ ├── Exam.css
│ │ │ ├── Exams.js
│ │ │ ├── Exams.css
│ │ │ ├── ForgotPasswordPage.js
│ │ │ ├── Home.css
│ │ │ ├── HomePage.js
│ │ │ ├── LoginPage.js
│ │ │ ├── Questions.css
│ │ │ ├── Questions.js
│ │ │ ├── RegisterPage.js
│ │ │ ├── ResetPasswordPage.js
│ │ │ ├── StudentDashboard.js
│ │ │ ├── StudentProfile.js
│ │ │ ├── StudentSettings.js
│ │ │ ├── Subjects.css
│ │ ├── App.css
│ │ ├── App.js
│ │ ├── App.test.js
│ │ ├── exam.jpg
│ │ ├── index.css
│ │ ├── index.js
│ │ ├── logo.svg
│ │ ├── reportWebVitals.js
│ │ ├── setupTests.js
│ ├── package.json
│ └── package-lock.json
├── .gitignore
└── README.md



---

##  Project Overview
This system enables administrators to manage subjects, exams, and questions in one place.  
Students can log in, take exams, and view their results (in progress).


---

##  Author

**Priya Bodade**  
GitHub: @PbLead1602