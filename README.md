# 🏦 MicroLoan - Loan Management System

A full-stack web application for managing loan applications with user authentication, role-based access control, and admin approval workflow.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![Tech Stack](https://img.shields.io/badge/Node.js-20-green)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-15-blue)
![Tech Stack](https://img.shields.io/badge/Docker-Compose-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- ✅ **User Registration & Authentication** - Secure signup/login with JWT tokens
- ✅ **Apply for Loans** - Submit loan applications with amount and purpose
- ✅ **View Applications** - Track status of your loan applications
- ✅ **Dashboard** - Personalized view of all your loans
- ✅ **AI Chatbot Assistant** - 24/7 support powered by Llama 3.2 local LLM

### Admin Features
- ✅ **Manage All Loans** - View applications from all users
- ✅ **Approve/Reject** - Review and update loan application status
- ✅ **Role-Based Access** - Admin-only routes protected by middleware

### Security
- ✅ **Password Hashing** - bcrypt encryption for user passwords
- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Protected Routes** - Middleware guards for authenticated endpoints
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **Role-Based Authorization** - Admin vs User permissions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js 20** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL 15** - Relational database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Ollama + Llama 3.2** - Local AI chatbot (1B parameters)

### DevOps
- **Docker & Docker Compose** - Containerization
- **Vite** - Build tool
- **Git** - Version control

## 🏗️ Architecture
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │─────▶│  Express    │─────▶│ PostgreSQL  │
│  Frontend   │◀─────│   Backend   │◀─────│  Database   │
│  (Port 5173)│      │ (Port 5000) │      │ (Port 5432) │
└─────────────┘      └──────┬──────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   Ollama    │
                     │  Llama 3.2  │
                     │(Port 11434) │
                     └─────────────┘
```

**Request Flow:**
1. User interacts with React frontend
2. Axios sends HTTP request to Express API
3. JWT middleware validates authentication
4. Express queries PostgreSQL database OR calls Ollama for AI chat
5. Response sent back through the chain

## 🚀 Getting Started

### Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop/))
- Git installed
- 4GB RAM minimum

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/microloan-app.git
   cd microloan-app
```

2. **Start the application**
```bash
   docker compose up
```

   That's it! Docker will:
   - Build all containers
   - Initialize the database
   - Start all services

3. **Pull the AI model (first time only)**
```bash
   docker exec -it microloan_ollama ollama pull llama3.2:1b
```

   This downloads the Llama 3.2 model (~1.3GB) - takes 1-2 minutes.

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Default Test Users

The database is pre-seeded with test accounts:

| Email | Password | Role |
|-------|----------|------|
| `john@example.com` | `hashed_password_123` | user |
| `admin@example.com` | `hashed_password_456` | admin |

**Note:** These passwords are hashed in the database. To create new users, use the registration page.

## 🤖 AI Chatbot Features

The application includes an intelligent chatbot powered by Llama 3.2 (1B parameters) running locally via Ollama.

### Capabilities
- ✅ Answers questions about loan processes
- ✅ Explains application requirements
- ✅ Provides loan amount information
- ✅ Guides users through the application
- ✅ Remembers conversation context
- ✅ 100% private - no data sent to external APIs

### How to Use
1. Click the blue chat button (bottom-right corner)
2. Ask questions like:
   - "What loan amounts do you offer?"
   - "How do I apply for a loan?"
   - "What are the requirements?"
   - "How long does approval take?"

### Technical Details
- **Model:** Llama 3.2 (1B parameters)
- **Provider:** Ollama (local deployment)
- **Features:** RAG-ready, conversation memory, system prompts
- **Privacy:** Fully local, no external API calls

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Loan Endpoints

#### Get All Loans
```http
GET /api/loans
Authorization: Bearer {token}
```

#### Create Loan Application
```http
POST /api/loans
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_id": 1,
  "amount": 50000,
  "purpose": "Home Renovation"
}
```

#### Get Single Loan
```http
GET /api/loans/:id
Authorization: Bearer {token}
```

#### Update Loan Status (Admin Only)
```http
PUT /api/loans/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved"
}
```

**Valid statuses:** `pending`, `approved`, `rejected`

### Chatbot Endpoint

#### Send Chat Message
```http
POST /api/chat
Content-Type: application/json

{
  "message": "What loan amounts do you offer?",
  "conversationHistory": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "We offer loans ranging from $1,000 to $1,000,000...",
    "model": "llama3.2:1b"
  }
}
```

## 📸 Screenshots

### Home Page
Landing page with login/register options

### User Dashboard
View and track your loan applications

### Apply for Loan
Submit new loan application with amount and purpose

### Admin Dashboard
Manage all loan applications with approve/reject actions

## 📁 Project Structure
```
microloan-app/
├── backend/
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   ├── userRoutes.js       # User management
│   │   └── loanRoutes.js       # Loan CRUD operations
│   │   └── chatRoutes.js       # AI chatbot endpoint (NEW)
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── utils/
│   │   └── auth.js             # bcrypt & JWT helpers
│   ├── db.js                   # PostgreSQL connection
│   ├── server.js               # Express app entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatBot.jsx     # AI chatbot UI (NEW)
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Registration page
│   │   │   ├── Dashboard.jsx   # User/Admin dashboard
│   │   │   └── ApplyLoan.jsx   # Loan application form
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── services/
│   │   │   └── api.js          # Axios API client
│   │   ├── App.jsx             # Route configuration
│   │   └── main.jsx            # React entry point
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   └── init.sql                # Database initialization
│
├── docker-compose.yml          # Multi-container orchestration
└── README.md
```

## 🔧 Environment Variables

### Backend
The backend uses the following environment variables (configured in `docker-compose.yml`):
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password123
DB_NAME=microloan
JWT_SECRET=your-secret-key-change-this-in-production
```

### Frontend
```env
VITE_API_URL=http://localhost:5000
```

**Note:** For production, use a `.env` file and never commit sensitive credentials to Git.

## 🛠️ Development

### Running Individual Services

**Backend only:**
```bash
docker compose up backend
```

**Frontend only:**
```bash
docker compose up frontend
```

**Database only:**
```bash
docker compose up postgres
```

### Rebuilding After Code Changes

Since volumes are not mounted for live reload, rebuild after making changes:
```bash
docker compose up --build
```

Or rebuild specific service:
```bash
docker compose up --build frontend
```

### Accessing the Database

Connect to PostgreSQL:
```bash
docker exec -it microloan_db psql -U postgres -d microloan
```

Useful SQL commands:
```sql
\dt                              -- List tables
\d users                         -- Describe users table
SELECT * FROM users;             -- View all users
SELECT * FROM loans;             -- View all loans
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';  -- Make user admin
\q                               -- Quit
```

### Stopping the Application
```bash
docker compose down
```

To remove volumes (clears database):
```bash
docker compose down -v
```

## 🧪 Testing

### Manual Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Create Loan (replace TOKEN):**
```bash
curl -X POST http://localhost:5000/api/loans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"user_id":1,"amount":50000,"purpose":"Car Purchase"}'
```

## 🔐 Security Considerations

### Implemented
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication (24-hour expiration)
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ Parameterized SQL queries (SQL injection prevention)
- ✅ CORS enabled

### Recommended for Production
- ⚠️ Use environment variables for secrets
- ⚠️ Enable HTTPS/SSL
- ⚠️ Add rate limiting
- ⚠️ Implement input sanitization (XSS protection)
- ⚠️ Add CSRF protection
- ⚠️ Use secure cookie flags
- ⚠️ Implement logging and monitoring
- ⚠️ Regular security audits

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Stop conflicting services
docker compose down
sudo lsof -ti:5000 | xargs kill  # Kill process on port 5000
sudo lsof -ti:5173 | xargs kill  # Kill process on port 5173
```

### Database Connection Failed
```bash
# Check if PostgreSQL container is running
docker ps

# View logs
docker logs microloan_db

# Restart database
docker compose restart postgres
```

### Tailwind CSS Not Working
```bash
# Rebuild frontend without cache
docker compose build --no-cache frontend
docker compose up
```

### Permission Denied Errors
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

### Ollama Not Responding
```bash
# Check if Ollama container is running
docker ps | grep ollama

# View Ollama logs
docker logs microloan_ollama

# Restart Ollama
docker compose restart ollama

# Pull model again if needed
docker exec -it microloan_ollama ollama pull llama3.2:1b
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@suhail1060](https://github.com/suhail1060)
- LinkedIn: [suhailkhani](https://linkedin.com/in/suhailkhani)

## 🙏 Acknowledgments

- Built as a learning project to understand full-stack development
- Inspired by real-world loan management systems
- Uses industry-standard technologies and best practices

## 📚 Learning Resources

If you want to learn more about the technologies used:
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [JWT Introduction](https://jwt.io/introduction)

---

**⭐ If you found this project helpful, please consider giving it a star!**