import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, User, Plus } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '../../../utils/cn';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Exchanges', href: '/exchanges', icon: MessageSquare, requiresAuth: true },
    { name: 'Profile', href: '/profile', icon: User, requiresAuth: true },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen p-4">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          if (item.requiresAuth && !isAuthenticated) {
            return null;
          }

          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-cf-dark-red text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={cn('mr-3 h-5 w-5', isActive ? 'text-white' : 'text-gray-400')} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Add Book Button */}
      {isAuthenticated && (
        <div className="mt-8">
          <Link
            to="/books/add"
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-cf-dark-red rounded-md hover:bg-red-700 transition-colors"
          >
            <Plus className="mr-3 h-5 w-5" />
            Add Book
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
