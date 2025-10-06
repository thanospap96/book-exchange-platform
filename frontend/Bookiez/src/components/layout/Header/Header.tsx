import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import AuthButton from '../../AuthButton';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Books', href: '/books' },
    { name: 'Exchanges', href: '/exchanges' },
    { name: 'Profile', href: '/profile' },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-cf-dark-red fixed w-full z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Bookiez</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-8 absolute md:static top-full left-0 w-full md:w-auto bg-cf-dark-red md:bg-transparent px-4 py-4 md:py-0`}
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block md:inline-block py-2 md:py-0 text-white font-medium hover:text-gray-200 transition-colors ${
                isActiveRoute(item.href)
                  ? 'border-b-2 border-white md:border-b-2'
                  : ''
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Auth Button */}
          <div className="mt-4 md:mt-0 md:ml-4">
            <AuthButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
