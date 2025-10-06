# Bookiez Frontend

A modern React application for the Bookiez book exchange platform.

## Features

- 🔐 User Authentication (Login/Register)
- 📚 Book Management (Add, Edit, Delete, Browse)
- 💬 Real-time Chat for Exchanges
- 🔍 Advanced Book Filtering
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Socket.IO Client** for real-time features
- **Lucide React** for icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── books/          # Book-related components
│   ├── chat/           # Chat components
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)
- `VITE_SOCKET_URL`: Socket.IO server URL (default: http://localhost:5000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Components

### UI Components
- `Button` - Customizable button component
- `Input` - Form input with validation
- `Modal` - Modal dialog component
- `LoadingSpinner` - Loading indicator

### Book Components
- `BookCard` - Book display card
- `BookForm` - Add/Edit book form
- `BookFilters` - Book search and filtering

### Chat Components
- `ChatWindow` - Main chat interface
- `Message` - Individual message display
- `MessageForm` - Message input form

## Services

- `authService` - Authentication operations
- `bookService` - Book CRUD operations
- `exchangeService` - Exchange operations
- `socketService` - Real-time communication
- `apiClient` - HTTP client with interceptors

## Contexts

- `AuthContext` - User authentication state
- `SocketContext` - Socket.IO connection management
- `NotificationContext` - Global notifications

## Custom Hooks

- `useAuth` - Authentication state and methods
- `useSocket` - Socket.IO connection and events
- `useBooks` - Book data management

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the established naming conventions
4. Add proper error handling
5. Write meaningful commit messages