# 🎓 TeacherLoggg

> Track Invisible Academic Work with Stranger Things Style

A retro 80s themed web application for teachers to log and document their academic contributions beyond lectures - mentoring, project guidance, research, workshops, and more. Perfect for appraisals and accreditation (NAAC/NBA).

![Stranger Things Theme](https://img.shields.io/badge/Theme-Stranger%20Things-red?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

## ✨ Features

- 🎤 **Voice Assistant** - Speak naturally to log contributions (hands-free entry)
- 📝 **Text Entry** - Traditional form-based logging
- 📊 **Dashboard** - Visual overview of your contributions with statistics
- 🤖 **AI Summarization** - GPT-4 powered summaries for appraisals (NAAC/NBA ready)
- 📱 **Responsive Design** - Works on all devices (mobile, tablet, desktop)
- 🎨 **Retro 80s Theme** - Stranger Things-inspired neon aesthetics
- ✏️ **Edit & Delete** - Full CRUD operations for contribution management
- ⏱️ **Time Tracking** - Automatic time categorization and reporting

## 🎭 Demo

**Live Preview**: [https://professor-log.preview.emergentagent.com](https://professor-log.preview.emergentagent.com)

### Screenshots

**Landing Page**: Retro 80s introduction with benefits
**Dashboard**: Real-time statistics and category breakdown  
**New Entry**: Voice or text input for quick logging
**History**: Edit, delete, and generate AI summaries

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Python 3.11+
- MongoDB
- OpenAI API Key (for AI summarization)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/teacherloggg.git
cd teacherloggg
```

2. **Setup Backend**
```bash
cd backend
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=teacherlog_db
CORS_ORIGINS=*
OPENAI_API_KEY=your_openai_api_key_here
EOF

# Start backend
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

3. **Setup Frontend**
```bash
cd frontend
yarn install

# Create .env file
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
EOF

# Start frontend
yarn start
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- MongoDB: localhost:27017

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
cd infra
docker-compose up --build
```

All services (Frontend, Backend, MongoDB) will start automatically!

### Manual Docker Build

```bash
# Backend
cd backend
docker build -t teacherlog-backend .
docker run -p 8001:8001 --env-file .env teacherlog-backend

# Frontend
cd frontend
docker build -t teacherlog-frontend .
docker run -p 3000:3000 --env-file .env teacherlog-frontend
```

## 🏗️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Component library
- **Web Speech API** - Voice recognition
- **Axios** - HTTP client
- **Sonner** - Toast notifications

### Backend
- **Python 3.11** - Programming language
- **FastAPI** - Web framework
- **MongoDB** - Database
- **Motor** - Async MongoDB driver
- **OpenAI API** - AI summarization
- **Pydantic** - Data validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Supervisor** - Process management

## 📂 Project Structure

```
teacherloggg/
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn components
│   │   │   ├── Navigation.jsx
│   │   │   ├── VoiceAssistant.jsx
│   │   │   └── ...
│   │   ├── pages/             # Main application pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NewEntry.jsx
│   │   │   └── History.jsx
│   │   ├── App.js             # Main application
│   │   └── index.css          # Global styles + design system
│   ├── Dockerfile
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── main.py                # FastAPI application
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
│
├── infra/
│   └── docker-compose.yml     # Multi-container setup
│
├── README.md
└── DEPLOYMENT_GUIDE.md
```

## 🎤 Voice Assistant Usage

1. Navigate to **New Entry** page
2. Click the floating microphone button (bottom-right)
3. Grant microphone permissions when prompted
4. Speak naturally:
   - "Student mentoring" → Auto-fills contribution type
   - "Say skip" → Skip optional reference field
   - "Thirty minutes" → Auto-fills time spent
   - Describe your work → Auto-fills description
5. Click "Save Contribution" when done

**Note**: Voice assistant works best in Chrome/Edge browsers

## 🤖 AI Summary Feature

1. Log multiple contributions
2. Go to **History** page
3. Click "AI Summary" button
4. Get a professional summary formatted for:
   - Teacher appraisals
   - NAAC/NBA accreditation
   - Performance reviews
   - Annual reports

## 🎨 Design System

The application uses a **Stranger Things-inspired design system**:

### Colors (HSL Format)
```css
--primary: 353 88% 50%        /* Neon Red */
--secondary: 186 100% 50%     /* Electric Blue */
--accent: 332 100% 56%        /* Magenta */
--background: 2 8% 3%         /* Nearly Black */
```

### Typography
- **Titles**: Lora (serif) - uppercase with letter-spacing
- **Body**: Inter (sans-serif) - clean and readable

### Visual Effects
- Scanline animations
- VHS noise overlay
- Neon glow effects
- Glitch animations
- Pulse animations

## 📝 API Endpoints

### Contributions
- `GET /api/` - Health check
- `GET /api/contributions` - List all contributions (max 1000)
- `POST /api/contributions` - Create new contribution
- `GET /api/contributions/{id}` - Get single contribution
- `PUT /api/contributions/{id}` - Update contribution
- `DELETE /api/contributions/{id}` - Delete contribution

### AI Features
- `POST /api/summarize` - Generate AI summary of contributions

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=teacherlog_db
CORS_ORIGINS=*
OPENAI_API_KEY=sk-...
```

**Frontend (.env)**
```bash
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
```

## 🌐 Browser Support

- ✅ Chrome/Edge (recommended for voice features)
- ✅ Firefox
- ✅ Safari (limited voice support)
- ✅ Mobile browsers

## 🐛 Troubleshooting

### Voice Assistant Not Working
- Use Chrome or Edge browser
- Grant microphone permissions
- Must be on HTTPS in production
- Navigate to "New Entry" page first

### API Connection Failed
- Verify backend is running on port 8001
- Check `REACT_APP_BACKEND_URL` in frontend/.env
- Ensure CORS is configured properly

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URL` in backend/.env
- For cloud: Use MongoDB Atlas connection string

## 🚀 Deployment

### Deploy on Emergent Platform

1. Push code to GitHub
2. Connect GitHub to Emergent
3. Emergent auto-detects stack
4. Add environment variables
5. Deploy! 🎉

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

### Deploy on Other Platforms

- **Vercel** (Frontend) + **Render** (Backend)
- **Netlify** (Frontend) + **Railway** (Backend)
- **AWS** / **Google Cloud** / **Azure**
- **DigitalOcean** / **Heroku**

## 📄 License

MIT License - Free to use for educational institutions!

## 🙏 Acknowledgments

- Inspired by Netflix's **Stranger Things**
- Built for educators worldwide
- Powered by **OpenAI GPT-4**

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- 📧 Email: support@teacherloggg.com
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/teacherloggg/issues)
- 📖 Docs: See `DEPLOYMENT_GUIDE.md`

## 🎯 Roadmap

- [ ] Export to PDF/Excel
- [ ] Multi-user support with authentication
- [ ] Calendar view for contributions
- [ ] Mobile app (React Native)
- [ ] Integration with university systems
- [ ] Analytics and insights dashboard
- [ ] Team collaboration features

---

**Made with ❤️ for Teachers**

*Track your impact. Get recognized. Streamline accreditation.*

⭐ **Star this repo if you find it helpful!**
