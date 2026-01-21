# Fix City – Civic Issue Reporting Platform

Fix City is a modern, responsive web application that empowers citizens to report civic issues (potholes, garbage overflow, broken streetlights, water leakage, etc.) in their city. Authorities and staff can track, assign, and resolve these issues efficiently.

---

![Fix City Logo](public/FIX_CITY.png)

---

Live: [FIX CITY](https://fix-city-1.web.app)

## 🚀 Features

### For Citizens

- Report issues with photo, location, category & description
- Upvote important issues
- Boost priority of own issue (paid feature – ৳100)
- Real-time status tracking with timeline
- Edit/Delete own pending issues
- Premium subscription for unlimited reporting
- Google & Email/Password authentication

### For Staff

- View assigned issues
- Update issue status (Pending → In-Progress → Working → Resolved → Closed)
- Personal dashboard with stats

### For Admin

- Full system overview dashboard
- Manage users (block/unblock)
- Manage staff (create/update/delete)
- Assign staff to issues
- Reject inappropriate reports
- View payment history & revenue

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, DaisyUI, Tanstack Query, React Hot Toast, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Authentication (Google + Email/Password)
- **Payment**: Stripe (Boost & Premium)
- **Image Hosting**: ImgBB
- **Deployment**: Firebase || CloudFlare || Netlify (Frontend), Vercel (Backend)

## 📂 Project Structure

```
fixcity/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Components/     # Reusable components (Loading, Navbar, Footer)
│   │   ├── Pages/          # All pages (Home, Dashboard, IssueDetails, etc.)
│   │   ├── Hooks/          # Custom hooks (useAxiosSecure, useAuth, useRole)
│   │   └── Context/        # AuthContext
│   └── ...
└── server/                 # Node.js backend
    ├── routes/
    ├── middleware/
    └── index.js
```

### Create .env.local

```
VITE_FIREBASE_API_KEY=YOUR FIREBASE API KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR FIREBASE AUTH DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR FIREBASE PROJECT ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR FIREBASE STORAGE BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR FIREBASE MESSAGING SENDER ID
VITE_FIREBASE_APP_ID=YOUR FIREBASE APP ID
VITE_IMG_BB_KEY=YOUR IMG BB KEY
```

## 🎨 UI/UX Highlights

- Fully responsive design (mobile-first)
- DaisyUI + Tailwind for beautiful components
- Lottie animations for loading states
- Timeline for issue tracking
- Card-based issue listing with priority highlighting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)  
See the [LICENSE](LICENSE) file for details.

### 👨‍💻 Author

**MD. Reazul Hasan**  
[![GitHub](https://img.shields.io/badge/GitHub-%40Reazul87-black?logo=github)](https://github.com/Reazul87)

---

**FixCity – Making cities better, one report at a time.** 🏙️✨

<!-- VITE_CitizenEmail=welcome@gmail.com
VITE_StaffEmail=welcome@staff.com
VITE_AdminEmail=welcome@admin.com
VITE_Password=Welcome123  -->
