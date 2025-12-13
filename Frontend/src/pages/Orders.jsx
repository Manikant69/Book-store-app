import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { useOrder } from '../hooks/useApi';
import { Loader } from '../components/common/Loader';
import Toast from '../utils/toast';

function Orders() {
  const { getUserOrders, cancelOrder } = useOrder();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      Toast.warning('Please login to view orders');
      window.location.href = '/login';
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      const result = await getUserOrders(userId);
      if (result) {
        setOrders(result);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    const result = await cancelOrder(userId, orderId);
    if (result) {
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: 'cancelled' } : order
      ));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No orders yet</p>
            <a href="/books" className="text-teal-600 dark:text-teal-400 hover:underline">
              Start shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="font-mono font-semibold dark:text-white">{order.orderId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                    <p className="dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
                    <p className="dark:text-white">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="font-semibold dark:text-white">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                    <p className="dark:text-white">{order.paymentMethod || 'COD'}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Items ({order.items.length})</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm dark:text-gray-300">
                        Book ID: {item.bookId} × {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Address</p>
                    <p className="dark:text-white">{order.shippingAddress}</p>
                  </div>
                )}

                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Orders;
