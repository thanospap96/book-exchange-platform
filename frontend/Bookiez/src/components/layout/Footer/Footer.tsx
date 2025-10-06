import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Report Issue', href: '/report' },
    ],
    social: [
      { name: 'Facebook', href: '#' },
      { name: 'Twitter', href: '#' },
      { name: 'Instagram', href: '#' },
      { name: 'LinkedIn', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-cf-dark-red" />
              <span className="text-xl font-bold">Bookiez</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Connect with fellow book lovers, exchange your favorite reads, and discover new worlds through the magic of sharing books.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-cf-dark-red" />
                <span className="text-gray-400 text-sm">support@bookiez.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-cf-dark-red" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-cf-dark-red" />
                <span className="text-gray-400 text-sm">123 Book Street, Library City, LC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Bookiez. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Made with ❤️ for book lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
