# 🌱 Sprout AI - Frontend

Frontend application for Sprout AI, a comprehensive health companion platform built with React, Vite, and Tailwind CSS.

## 📋 Overview

Sprout AI is a full-stack healthcare application that provides:

- AI-powered symptom analysis and health guidance
- Emergency detection and alert system
- Natural remedies database with search functionality
- Role-based access control for different user types
- Real-time chat interface with AI assistant

The frontend is a modern React application that communicates with a Node.js/Express backend API and uses Supabase for authentication and database management.

## ✨ Features

### Core Features

- **🗨️ Symptom Chat Interface**
  - Real-time messaging with AI health assistant
  - Session-based conversation history
  - Markdown support for formatted responses
  - Loading states and typing indicators
  - Auto-scroll to latest messages

### 🛡️ Emergency Detection System

- Automatic detection of emergency keywords
- Severity-based alerts (critical, warning, info)
- Visual emergency overlays and notifications
- Integration with admin dashboard for emergency monitoring

### 🌿 Natural Remedies Library

- Searchable database of natural remedies
- Category filtering and search functionality
- Detailed remedy information:
  - Ingredients list
  - Benefits and usage instructions
  - Warnings and precautions
  - Preparation steps

### 🔐 Authentication & Authorization

- Secure authentication via Supabase
- Multiple user roles:
  - **Regular Users**: Access to chat and remedies
  - **Hospital Staff**: Additional dashboard access
  - **Administrators**: Full system access
- Protected routes with role-based access control
- Session management and automatic token refresh

### 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Cross-browser compatibility

## 🛠️ Tech Stack

### Core Technologies

- **React 19** - Modern UI library with concurrent features
- **React DOM** - React rendering for web
- **Vite 7** - Next-generation frontend tooling

### Routing & Navigation

- **React Router DOM 7** - Client-side routing with nested routes and protected route patterns

### Styling

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS transformation
- **Autoprefixer** - Automatic vendor prefixes
- **Tailwind Merge** - Merge Tailwind CSS classes dynamically
- **CLSX** - Conditional className utility

### State Management

- **React Context API** - Built-in state management
- Custom hooks for state logic separation
- Optimistic UI updates for better UX

### Authentication & Backend

- **@supabase/supabase-js** - Supabase client for auth and database
- **Axios** - HTTP client for API requests
- JWT-based authentication with automatic token injection

### Icons & UI Components

- **Lucide React** - Beautiful and consistent icon set
- Custom React components (Toast, EmergencyAlert)

### Development Tools

- **ESLint** - Code linting with React-specific rules
- **Vite** - Fast development server and build tool

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
│   └── vite.svg            # Vite logo
├── src/
│   ├── assets/             # Static assets (images, fonts)
│   │   └── react.svg      # React logo
│   ├── components/         # Reusable UI components
│   │   ├── EmergencyAlert.jsx  # Emergency notification component
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   └── ui/                  # UI component library
│   │       └── Toast.jsx        # Toast notification component
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx      # Authentication state management
│   │   ├── ChatContext.jsx      # Chat sessions state management
│   │   └── ToastContext.jsx     # Toast notifications state
│   ├── lib/                # Library configurations
│   │   └── supabaseClient.js    # Supabase client initialization
│   ├── pages/              # Page components (routes)
│   │   ├── Chat.jsx            # Main chat interface
│   │   ├── Dashboard.jsx       # Admin dashboard (protected)
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   └── Remedies.jsx        # Remedies search page
│   ├── services/           # API services
│   │   └── api.js              # Axios instance with interceptors
│   ├── App.css            # Global styles
│   ├── App.jsx            # Main app component with routing
│   ├── index.css          # Tailwind CSS imports
│   └── main.jsx           # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── eslint.config.js       # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** version 18 or higher
- **npm** or **yarn** package manager
- **Supabase** account (for authentication and database)

### Installation

1. **Clone the repository**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `frontend` directory:

   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

   > **Note**: Get these values from your Supabase project settings:
   >
   > - Go to Supabase Dashboard → Settings → API
   > - Copy the "Project URL" and "anon public" key

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open the application**

   Navigate to `http://localhost:5173` in your browser

### Available Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start development server with hot reload     |
| `npm run build`   | Build for production (creates `dist` folder) |
| `npm run preview` | Preview production build locally             |
| `npm run lint`    | Run ESLint to check code quality             |

## 🔧 Environment Variables

| Variable                 | Description                   | Required                                     |
| ------------------------ | ----------------------------- | -------------------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL     | Yes                                          |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key | Yes                                          |
| `VITE_API_BASE_URL`      | Backend API base URL          | No (defaults to `http://localhost:3000/api`) |

## 🏗️ Architecture

### State Management Architecture


The application uses React Context API for state management with three main providers:

```
┌─────────────────────────────────────────────────────────────┐
│                      AuthProvider                           │
│  Manages:                                                    │
│  - User authentication state                                 │
│  - User session and tokens                                   │
│  - User role (user/admin/hospital)                           │
│  - Loading states                                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      ChatProvider                            │
│  Manages:                                                    │
│  - Chat sessions list                                        │
│  - Current session state                                     │
│  - Sidebar chat history                                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     ToastProvider                            │
│  Manages:                                                    │
│  - Toast notifications queue                                 │
│  - Toast display logic                                       │
│  - Toast auto-dismissal                                      │
└─────────────────────────────────────────────────────────────┘
```

### Routing Structure

```
Routes
├── /login           → Login Page (Public)
├── /register        → Register Page (Public)
└── Protected Routes (Require Authentication)
    ├── /            → Redirects to /chat
    ├── /chat        → Main Chat Interface
    │   └── /chat/:sessionId → Chat Session with History
    ├── /remedies    → Remedies Search Page
    └── /dashboard   → Admin Dashboard (Admin/Hospital only)
```

### API Layer

The application uses Axios for HTTP requests with:

- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Request Interceptor**: Automatically attaches Supabase auth token
- **Response Handling**: Centralized error handling

```javascript
// API Service Structure
api/
├── axios.create({
│   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
│ })
├── interceptors.request.use(async (config) => {
│   // Attach Supabase session token to every request
│   const { data: { session } } = await supabase.auth.getSession();
│   if (session?.access_token) {
│       config.headers.Authorization = `Bearer ${session.access_token}`;
│   }
│   return config;
│ })
└── Exports
    ├── api.get(endpoint)
    ├── api.post(endpoint, data)
    ├── api.put(endpoint, data)
    └── api.delete(endpoint)
```

## 📄 Pages Overview

### Login Page (`/login`)

- Email/password authentication
- Supabase Auth integration
- Redirect to chat on success
- Link to registration page
- Error handling with toast notifications

### Register Page (`/register`)

- User registration with email/password
- Profile creation flow
- Automatic login after registration
- Form validation
- Toast notifications for feedback

### Chat Page (`/chat` & `/chat/:sessionId`)

- **Features**:
  - AI-powered symptom analysis
  - Real-time messaging interface
  - Session persistence in URL
  - Message history per session
  - Emergency keyword detection
  - Auto-scroll to new messages
  - Typing indicators
  - Optimistic UI updates

- **Components**:
  - Message bubbles (user/AI distinction)
  - System messages (info, warnings)
  - Emergency alert overlays
  - Loading states with animations
  - Input field with validation

### Remedies Page (`/remedies`)

- **Features**:
  - Searchable remedies database
  - Real-time search filtering
  - Expandable remedy cards
  - Ingredient and benefit lists
  - Preparation instructions
  - Warning and precaution notices

- **UI Components**:
  - Search input with icon
  - Loading skeletons
  - Empty state handling
  - Accordion-style cards
  - Alert boxes for warnings

### Dashboard Page (`/dashboard`)

- **Access**: Admin and Hospital roles only
- **Features**:
  - Emergency monitoring
  - System overview metrics
  - User management
  - Activity logs
  - Role-based data visualization

## 🔐 Security Features

### Authentication Security

- JWT-based authentication via Supabase
- Automatic token refresh
- Secure session management
- Protected API routes with token validation

### Route Protection

- All routes except login/register are protected
- Role-based access control (RBAC)
- Automatic redirects for unauthorized access
- Loading states during auth checks

### Data Protection

- Row Level Security (RLS) on Supabase
- API authentication middleware
- Secure token storage
- No sensitive data in frontend code

### Best Practices

- Environment variables for secrets
- CORS configuration on backend
- Input sanitization
- XSS protection via React
- CSRF protection via Supabase

## 🎨 Styling

### Tailwind CSS Configuration

The project uses a custom Tailwind configuration with:

```javascript
// tailwind.config.js
{
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    emergency: {
      500: '#ef4444',
      600: '#dc2626',
    }
  },
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
  }
}
```

### Design System

- **Primary Color**: Green palette for health/wellness theme
- **Emergency Color**: Red palette for alerts
- **Typography**: Inter font family
- **Border Radius**: Rounded corners (xl, 2xl)
- **Shadows**: Subtle shadows for depth
- **Animations**: Smooth transitions and micro-interactions

## 🧪 Development

### Code Quality

- ESLint with React hooks rules
- Consistent code formatting
- Component-based architecture
- Custom hooks for reusable logic

### Best Practices

- Functional components with hooks
- PropTypes or TypeScript (if configured)
- Semantic HTML
- Accessible markup
- Responsive design principles

### Performance Optimization

- Code splitting via React Router
- Lazy loading for routes
- Optimized re-renders with React.memo
- Efficient state updates
- Image optimization

## 📦 Building for Production

### Build Command

```bash
npm run build
```

This creates a `dist` folder with optimized production files:

- Minified JavaScript
- Optimized CSS
- Compressed assets
- Ready for deployment

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `dist` folder
- **AWS S3**: Upload `dist` contents
- **Any static host**: Cloudflare Pages, GitHub Pages, etc.

## 🤝 Integration with Backend

### API Endpoints Used

- `GET /api/chat/session/:id/messages` - Fetch chat messages
- `POST /api/chat/session` - Create new chat session
- `POST /api/chat/message` - Send message to AI
- `GET /api/remedies` - Search remedies
- `GET /api/emergencies` - Fetch emergencies (admin)
- Auth endpoints via Supabase

### Database Tables

- `users` - User profiles with roles
- `chat_sessions` - Chat session metadata
- `messages` - Individual chat messages
- `remedies` - Natural remedies data

## 📝 License

This project is part of the Sprout AI Health Companion Platform.

## 🙏 Acknowledgments

- **React Team** for the amazing React library
- **Tailwind CSS** for the utility-first CSS framework
- **Supabase** for the backend-as-a-service platform
- **Lucide** for the beautiful icons
- **Vite** for the fast build tool

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Built with 💚 for better healthcare accessibility**
