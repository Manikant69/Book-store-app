import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { UsersManagement } from '../components/admin/UsersManagement';
import { BooksManagement } from '../components/admin/BooksManagement';
import { OrdersManagement } from '../components/admin/OrdersManagement';
import { GenresManagement } from '../components/admin/GenresManagement';
import { SiteSettingsManagement } from '../components/admin/SiteSettingsManagement';
import { AdminStats } from '../components/admin/AdminStats';
import { Users, Book, ShoppingCart, Tag, BarChart3, Settings } from 'lucide-react';
import Toast from '../utils/toast';

const TABS = [
  { id: 'stats', label: 'Dashboard', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'books', label: 'Books', icon: Book },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'genres', label: 'Genres', icon: Tag },
  { id: 'settings', label: 'Settings', icon: Settings }
];

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('stats');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole !== 'admin') {
      Toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
  }, [userRole, navigate]);

  if (userRole !== 'admin') {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminStats />;
      case 'users':
        return <UsersManagement />;
      case 'books':
        return <BooksManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'genres':
        return <GenresManagement />;
      case 'settings':
        return <SiteSettingsManagement />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your BookSpot platform</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          <nav className="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                  activeTab === id
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
      <Footer />
    </div>
  );
}

export default AdminPanel;