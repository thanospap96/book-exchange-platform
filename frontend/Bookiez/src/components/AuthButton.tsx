import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button/Button';

const AuthButton: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-white text-sm">
          Welcome, {user.firstName}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-white border-white hover:bg-white hover:text-cf-dark-red"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link to="/login">
        <Button
          variant="outline"
          size="sm"
          className="text-white border-white hover:bg-white hover:text-cf-dark-red"
        >
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white text-cf-dark-red hover:bg-gray-100"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default AuthButton;
