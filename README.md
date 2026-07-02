# 🩸 LifeSaver

Smart Blood Bank & Emergency Blood Donation Management System

**Tagline:** "Every Drop Counts, Every Donor Matters."

## 📖 Project Overview

LifeSaver is a modern, full-stack web application built to connect blood donors, blood banks, hospitals, patients, and supporters on a single platform. The system aims to reduce the time required to find compatible blood, improve blood storage management, encourage voluntary donations, and support blood banks through secure online financial contributions.

## 🎯 Key Features

- **Real-time Notifications:** Instant alerts for emergency blood requests
- **Blood Inventory Management:** Track blood availability across all blood banks
- **Appointment Scheduling:** Book donation appointments conveniently
- **Digital Certificates:** QR code-verified donation certificates
- **Financial Donations:** Secure online donations to support blood bank operations
- **Analytics Dashboard:** Comprehensive statistics and reports
- **Role-Based Access:** Separate dashboards for Admin, Donor, Hospital, and Blood Bank staff
- **Emergency Alerts:** Critical blood request notifications

## 👥 User Roles

1. **Admin** - Manage users, approve blood banks, monitor inventory, generate reports
2. **Blood Bank Staff** - Register donations, manage storage, process requests
3. **Donor** - Register, book appointments, view history, download certificates
4. **Hospital** - Search blood, submit requests, track status
5. **Financial Donor** - Donate money, support campaigns, download receipts
6. **Public Visitor** - Search blood, learn about donation, register

## 💻 Technology Stack

### Frontend
- React.js 18
- React Router DOM
- Axios
- React Icons
- Chart.js
- Framer Motion
- Socket.IO Client
- TailwindCSS

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Multer (File Uploads)
- PDFKit (PDF Generation)
- QRCode (QR Code Generation)

## 📁 Project Structure

```
LifeSaver/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── donor/
│   │   │   ├── hospital/
│   │   │   ├── bloodbank/
│   │   │   └── admin/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.md
│
├── docs/
│   ├── API_Documentation.md
│   └── ER_Diagram.png
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lifesaver
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lifesaver
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Run the Backend**
   ```bash
   cd server
   npm run dev
   ```

7. **Run the Frontend**
   ```bash
   cd client
   npm run dev
   ```

8. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Default Admin Access

To create an admin user, you'll need to register through the application and then manually update the user's role in the database, or use the MongoDB shell:

```javascript
use lifesaver
db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin", isVerified: true, isActive: true}})
```

## 📊 Database Schema

The application uses MongoDB with the following main collections:

- **users** - User authentication and profiles
- **donors** - Donor-specific information
- **hospitals** - Hospital profiles and requests
- **bloodbanks** - Blood bank information
- **bloodbags** - Blood inventory and tracking
- **appointments** - Donation appointments
- **bloodrequests** - Blood requests from hospitals
- **certificates** - Digital donation certificates
- **campaigns** - Fundraising campaigns
- **financialdonations** - Monetary donations
- **notifications** - User notifications

## 🧪 Blood Components

The system supports the following blood components:
- Whole Blood
- Red Blood Cells
- Plasma
- Platelets
- Cryoprecipitate

## 🏆 Rewards & Badges

### Blood Donation Milestones
- 1 Donation → First Hero
- 3 Donations → Bronze Lifesaver
- 5 Donations → Silver Lifesaver
- 10 Donations → Gold Lifesaver
- 20 Donations → Platinum Donor
- 50 Donations → Legend Donor

### Financial Supporter Badges
- Supporter
- Bronze Sponsor
- Silver Sponsor
- Gold Sponsor
- Platinum Sponsor
- LifeSaver Champion

## 📝 API Documentation

Detailed API documentation is available in `docs/API_Documentation.md`

## 🌟 Future Enhancements

- AI-based blood demand prediction
- Nearby donor matching using maps
- Multi-language support (English, Telugu, Hindi)
- Dark/Light theme
- SMS and Email notifications
- Offline mode for blood banks
- Mobile application (React Native)
- Accessibility features
- Integration with government health systems

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ❤️ Acknowledgments

- All blood donors who save lives every day
- Blood bank staff working tirelessly
- Healthcare professionals serving the community

---

**Built with ❤️ to save lives**
