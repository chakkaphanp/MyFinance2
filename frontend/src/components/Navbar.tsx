import React from 'react';
import { LogOut, Home, List, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            MF
          </div>
          <span className="text-xl font-bold text-gray-900">MyFinance</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/transactions" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <List size={20} />
            <span>Transactions</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Settings size={20} />
            <span>Settings</span>
          </Link>

          <div className="border-l border-gray-200 pl-6 flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
