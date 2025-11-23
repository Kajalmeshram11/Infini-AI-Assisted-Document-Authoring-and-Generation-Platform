# AI-Assisted Document Authoring and Generation Platform

A full-stack web application that leverages AI to help users generate, refine, and export professional business documents in Microsoft Word (.docx) and PowerPoint (.pptx) formats.

## 🎯 Features

- **User Authentication**: Secure JWT-based registration and login
- **Project Management**: Create, view, and manage multiple document projects
- **AI-Powered Content Generation**: Automatically generate document content using Google's Gemini AI
- **Interactive Refinement**: Iteratively improve content with AI-assisted editing
- **Feedback System**: Like/dislike functionality and comments for each section
- **Document Export**: Download finalized documents as .docx or .pptx files
- **AI Template Suggestions**: Automatically generate document outlines or slide titles

## 🏗️ Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite
- **AI Integration**: Google Gemini API
- **Authentication**: JWT (PyJWT)
- **Document Generation**: python-docx, python-pptx

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd docgen-platform
```

### 2. Backend Setup

#### Create a virtual environment
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### Install Python dependencies
```bash
pip install flask flask-cors pyjwt werkzeug google-generativeai python-docx python-pptx
```

#### Create a `.env` file in the backend directory
```bash
SECRET_KEY=your-secret-key-here-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
```

#### Initialize the database
The database will be automatically created when you run the application for the first time.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Update API endpoint (if needed)
If your backend runs on a different port, update the `API_BASE` constant in `src/App.jsx`:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

## 🎮 Running the Application

### Start the Backend Server

```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| SECRET_KEY | Secret key for JWT token generation | Yes |
| GEMINI_API_KEY | Google Gemini API key for AI generation | Yes |

### Frontend

No environment variables required for development. For production, update the `API_BASE` URL.

## 🗂️ Project Structure

```
docgen-platform/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── docgen.db             # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   └── index.js          # Entry point
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## 📖 Usage Guide

### 1. User Registration & Login

- Navigate to `http://localhost:3000`
- Click "Register" to create a new account
- Provide your name, email, and password
- After registration, you'll be automatically logged in

### 2. Creating a New Project

1. Click "New Project" on the dashboard
2. Select document type (Word or PowerPoint)
3. Enter your topic/main prompt
4. Define the outline:
   - Manually add, edit, reorder, or remove sections
   - Or click "AI Suggest" to auto-generate an outline
5. Click "Create & Generate Content"

### 3. Content Generation

- The system automatically generates content for each section
- Generation may take 30-60 seconds depending on document size
- Content is generated using AI based on your topic and section titles

### 4. Refining Content

For each section, you can:

- **Refine with AI**: Enter a prompt like:
  - "Make this more formal"
  - "Convert to bullet points"
  - "Shorten to 100 words"
  - "Add statistics and data"
  
- **Provide Feedback**: Click thumbs up/down to rate the content

- **Add Comments**: Add notes or instructions for future reference

### 5. Exporting Documents

- Click "Export Document" in the top right
- The system generates a properly formatted .docx or .pptx file
- File automatically downloads to your computer

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `DELETE /api/projects/<id>` - Delete project

### Sections
- `GET /api/projects/<id>/sections` - Get project sections
- `POST /api/projects/<id>/generate` - Generate content for all sections
- `POST /api/sections/<id>/refine` - Refine section content
- `POST /api/sections/<id>/feedback` - Update like/dislike
- `POST /api/sections/<id>/comment` - Update comment

### AI Features
- `POST /api/ai/suggest-outline` - Generate AI outline

### Export
- `GET /api/projects/<id>/export` - Export document

## 🎨 Key Features Explained

### AI Content Generation

The system uses Google's Gemini AI to:
- Generate contextual content for each section
- Create appropriate content based on document type (detailed paragraphs for Word, bullet points for PowerPoint)
- Maintain consistency with the overall topic

### Iterative Refinement

Users can refine content multiple times:
- Each refinement is stored in history
- Previous versions are preserved
- AI understands context from previous content

### Document Assembly

- **Word Documents**: Creates properly formatted .docx files with headings, paragraphs, and styling
- **PowerPoint**: Creates professional presentations with title slides, content slides, and bullet points

## 🐛 Troubleshooting

### Backend Issues

**Database errors**
```bash
# Delete the database and restart
rm docgen.db
python app.py
```

**Import errors**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**Gemini API errors**
- Verify your API key is correct
- Check you have API quota remaining
- Ensure you're using a valid API key from Google AI Studio

### Frontend Issues

**CORS errors**
- Ensure Flask-CORS is installed: `pip install flask-cors`
- Verify backend is running on port 5000

**Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Production Deployment

### Backend

1. Set strong SECRET_KEY in environment variables
2. Use production WSGI server (gunicorn):
```bash
pip install gunicorn
gunicorn app:app
```

3. Use PostgreSQL instead of SQLite for production
4. Enable HTTPS
5. Set proper CORS origins

### Frontend

1. Build the production bundle:
```bash
npm run build
```

2. Serve the build folder with nginx or similar
3. Update API_BASE to production backend URL

## 🔒 Security Considerations

- JWT tokens expire after 30 days
- Passwords are hashed using Werkzeug security
- User data is isolated per account
- API endpoints require authentication
- Input validation on all endpoints

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Create Word document project
- [ ] Create PowerPoint project
- [ ] AI outline generation works
- [ ] Content generation completes
- [ ] Refinement prompts work
- [ ] Like/dislike saves correctly
- [ ] Comments save correctly
- [ ] Export Word document
- [ ] Export PowerPoint document
- [ ] Logout works
- [ ] Projects persist after logout/login

## 📝 Sample Prompts for Testing

### Document Topics
- "Market analysis of electric vehicles in 2025"
- "Business proposal for sustainable fashion startup"
- "Technical documentation for REST API"
- "Marketing strategy for mobile app launch"

### Refinement Prompts
- "Make this more professional and formal"
- "Simplify the language for a general audience"
- "Add specific examples and case studies"
- "Convert to bullet points"
- "Expand with more details"
- "Reduce to 150 words"

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is provided as-is for evaluation purposes.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Gemini AI documentation
4. Create an issue in the repository



---

**Built with ❤️ using Flask, React, and Google Gemini AI**
