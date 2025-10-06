import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import HomePage from './pages/HomePage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import BookList from './pages/BookList/BookList';
// import './styles/globals.css';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/books" element={<BookList />} />
                  <Route path="/exchanges" element={<div className="pt-20 p-8"><h1 className="text-3xl font-bold">Exchanges Page - Coming Soon</h1></div>} />
                  <Route path="/profile" element={<div className="pt-20 p-8"><h1 className="text-3xl font-bold">Profile Page - Coming Soon</h1></div>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App

