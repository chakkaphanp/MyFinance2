import React, { useState } from 'react';
import { LogOut, Home, List, Settings, Menu, X, Target, Repeat } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/transactions', label: 'Transactions', icon: List },
    { path: '/budgets', label: 'Budgets', icon: Target },
    { path: '/recurring', label: 'Recurring', icon: Repeat },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="bg-gradient-to-r from-clay-light to-clay-white border-b border-clay-gray sticky top-0 z-40" style={{ boxShadow: '0 4px 12px rgba(255, 159, 90, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div 
                className="w-8 h-8 bg-gradient-to-br from-clay-primary to-clay-secondary rounded flex items-center justify-center text-white font-bold text-sm"
                style={{ borderRadius: '20px' }}
              >
                MF
              </div>
              <span className="text-lg font-medium text-clay-dark hidden sm:inline">MyFinance</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link flex items-center gap-2 px-3 py-2 rounded transition-all duration-300 ${
                    isActive(path) ? 'text-clay-primary' : 'text-clay-dark hover:text-clay-primary'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop User Info & Logout */}
            <div className="hidden md:flex items-center gap-4 border-l border-clay-gray pl-6">
              <div className="text-right">
                <p className="text-sm font-medium text-clay-dark">{user?.name}</p>
                <p className="text-xs text-clay-dark opacity-60">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-clay-coral hover:text-white hover:bg-gradient-to-br hover:from-clay-coral hover:to-clay-pink rounded transition-all duration-300"
                style={{ borderRadius: '20px' }}
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-clay-dark hover:text-clay-primary hover:bg-clay-light rounded transition-all duration-300"
              style={{ borderRadius: '20px' }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-clay-light to-clay-white border-b border-clay-gray mobile-menu animate-slide-in-down" style={{ boxShadow: '0 4px 12px rgba(255, 159, 90, 0.08)' }}>
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {/* Mobile Nav Items */}
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all duration-300 ${
                  isActive(path)
                    ? 'text-clay-primary bg-clay-light'
                    : 'text-clay-dark hover:bg-clay-light hover:text-clay-primary'
                }`}
                style={{ borderRadius: '4px' }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}

            {/* Mobile User Info */}
            <div className="px-4 py-3 border-t border-clay-gray mt-3">
              <p className="text-sm font-medium text-clay-dark">{user?.name}</p>
              <p className="text-xs text-clay-dark opacity-60">{user?.email}</p>
            </div>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-clay-coral to-clay-pink hover:opacity-90 rounded transition-all duration-300"
              style={{ borderRadius: '20px' }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
