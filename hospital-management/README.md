# 병원 영업 관리 시스템 MVP

여러 협력사가 함께 사용하는 병원 영업 관리 대시보드 시스템입니다.

## 🚀 Features

- **캔버스 1**: 내 담당 병원 상세 관리
- **캔버스 2**: 전체 병원 방문 현황
- **캔버스 3**: 지도 기반 동선 계획
- **Admin**: 병원/의사/협력사 관리 (관리자 전용)

## 🔐 Demo Login Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`
- Access: All features including Admin panel

### User Account
- Username: `user`
- Password: `user123`
- Access: Canvas 1, 2, 3 only

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Manual Build

```bash
npm run build
# The dist/ folder contains production-ready files
```

## 📁 Project Structure

```
hospital-management/
├── src/
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AllHospitals.jsx
│   │   ├── MapPlanner.jsx
│   │   └── Admin.jsx
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx
│   │   └── PrivateRoute.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Inline styles (Dark theme)
- **Authentication**: Local storage + Context API
- **Data**: Mock data (demo only)

## 📝 Notes

This is a **demo/MVP version** with:
- Mock data (no backend)
- Simple authentication (for demo purposes)
- No database connection

For production use, you would need to:
- Add backend API (Node.js/FastAPI)
- Implement real authentication (JWT)
- Connect to database (PostgreSQL/MySQL)
- Add proper error handling
- Implement form validation
