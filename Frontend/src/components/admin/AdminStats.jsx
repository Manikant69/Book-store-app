import React, { useState, useEffect } from 'react';
import { Users, Book, ShoppingCart, Tag, TrendingUp, DollarSign } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';

export function AdminStats() {
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    orders: 0,
    genres: 0,
    revenue: 0,
    recentOrders: [],
    trends: {
      users: '+0%',
      books: '+0',
      orders: '+0%',
      revenue: '$0'
    }
  });
  const [loading, setLoading] = useState(true);
  const { getAdminStats } = useAdmin();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const result = await getAdminStats();
      if (result && result.success) {
        setStats(result.stats);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'bg-blue-500',
      trend: stats.trends?.users || '+0%'
    },
    {
      title: 'Total Books',
      value: stats.books,
      icon: Book,
      color: 'bg-green-500',
      trend: stats.trends?.books || '+0'
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      trend: stats.trends?.orders || '+0%'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.revenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      trend: stats.trends?.revenue || '$0'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statCards.map(({ title, value, icon: Icon, color, trend }) => {
          const isPositive = trend.includes('+') || (!trend.includes('-') && trend !== '$0' && trend !== '+0');
          const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
          
          return (
            <div key={title} className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`h-2 w-2 sm:h-3 sm:w-3 ${trendColor} mr-1`} />
                    <span className={`text-xs ${trendColor}`}>{trend}</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${color}`}>
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentOrders?.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{order._id?.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {order.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}