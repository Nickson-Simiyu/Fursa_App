# **Fursa App**

Fursa App is a mobile application designed to help users discover job opportunities, apply for them seamlessly, and manage their career applications—all in one place. Built using **React Native** for the frontend and **Django REST Framework** for the backend, Fursa App is the perfect project to showcase mobile and web development skills.

![alt text](<WhatsApp Image 2024-11-22 at 20.56.46.jpeg>)
![alt text](<WhatsApp Image 2024-11-22 at 20.56.46 (2).jpeg>)
![alt text](<WhatsApp Image 2024-11-22 at 20.56.46 (1).jpeg>)
![alt text](<WhatsApp Image 2024-11-22 at 20.56.45.jpeg>)
---

## **Features**

### 📌 Job Features:
- **Browse Jobs:** View available job listings tailored for you.
- **Easy Apply:** Submit job applications with a cover letter and resume in just a few clicks.
- **Track Applications:** Keep track of all the jobs you've applied for, along with their status.

### 📌 User Profile:
- **Profile Management:** Create and update your profile with essential information such as name, bio, skills, resume, and profile image.
- **Upload Files:** Securely upload and manage your resume and profile image.

### 📌 User Authentication:
- **JWT Authentication:** Secure login and registration system to protect user data.
- **Token Refresh:** Maintain active sessions with seamless token management.

---

## **Technology Stack**

### 🛠️ Frontend:
- **React Native:** Framework for building cross-platform mobile apps.
- **Expo:** Simplified development, debugging, and deployment.
- **React Navigation:** Smooth navigation between app screens.

### 🛠️ Backend:
- **Django REST Framework (DRF):** API development.
- **PostgreSQL:** Database for storing application data.
- **Secure File Storage:** Handling user-uploaded files (resumes, profile images).

---

## **Installation and Setup**

### **Prerequisites**
- **Node.js** and **npm** or **yarn**
- **Python 3.x** and **pip**
- **Expo CLI**
- **PostgreSQL** (or your preferred database)

---

### **Steps to Run the App Locally**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Nickson-Simiyu/Fursa_App.git
   cd Fursa-App
   ```

2. **Frontend Setup:**
   ```bash
   cd fursa_frontend
   npm install
   npm start
   ```

3. **Backend Setup:**
   ```bash
   cd fursa_backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

4. **Environment Variables:**
   Configure `.env` files for the frontend and backend:
   - **Frontend:** Add your backend API base URL.
   - **Backend:** Configure your database and JWT settings.

5. **Start the App:**
   - Open the **Expo Go** app on your mobile device and scan the QR code from `npm start`.

---

## **API Endpoints**

| Endpoint               | Method | Description                      |
|------------------------|--------|----------------------------------|
| `/api/register/`       | POST   | User registration               |
| `/api/login/`          | POST   | User login                      |
| `/api/profiles/`       | GET    | Retrieve user profile           |
| `/api/profiles/<id>/`  | PATCH  | Update user profile             |
| `/api/jobs/`           | GET    | List all jobs                   |
| `/api/applications/`   | POST   | Submit a job application        |
| `/api/applications/`   | GET    | List user’s job applications    |

---

## **Key Learnings**

- Building and connecting RESTful APIs to a mobile frontend.
- Managing state and navigation in React Native.
- Handling file uploads securely in Django.
- Implementing JWT authentication.
- Debugging and improving user experience.

---

## **Contributing**

Feel free to fork the repository, open issues, or submit pull requests to improve the app. Contributions are welcome and greatly appreciated!

---

## **License**

This project is licensed under the MIT License.

---

## **Contact**

For any questions or feedback, reach out to me at **simiyunickson1@gmail.com** or open an issue in the repository.  

---
😊
