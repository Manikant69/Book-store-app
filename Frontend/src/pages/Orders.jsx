import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Package, Calendar, MapPin } from 'lucide-react';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { useOrder } from '../hooks/useApi';
import { Loader } from '../components/common/Loader';
import Toast from '../utils/toast';

function Orders() {
  const { getUserOrders, cancelOrder } = useOrder();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    // Immediate check - if no userId, stop loading and show login prompt
    if (!userId) {
      setLoading(false); // Important: stop loading immediately
      Toast.warning('Please login to view orders');
      navigate('/login');
      return;
    }

    // Validate userId format (should be MongoDB ObjectId format)
    if (userId.length < 10) {
      setLoading(false);
      setError('Invalid session. Please login again.');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      // Add timeout to prevent infinite loading - reduced to 3 seconds
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError('Request timed out. Please check your connection.');
        // Don't show toast here to avoid duplicates
      }, 3000); // 3 second timeout to match axios
      
      try {
        const result = await getUserOrders(userId);
        clearTimeout(timeoutId); // Clear timeout if API responds
        
        if (result && result.success) {
          setOrders(result.orders || []);
          setError(null);
        } else if (result && !result.success && result.error === 'User not found') {
          setOrders([]);
          setError('Invalid session. Please login again.');
          // Clear invalid userId from localStorage
          localStorage.removeItem('userId');
        } else if (result && result.error) {
          setOrders([]);
          setError(result.error);
        } else {
          setOrders([]);
          setError(null); // Don't set error if just no orders
        }
      } catch (error) {
        clearTimeout(timeoutId); // Clear timeout on error
        setOrders([]);
        setError('Failed to connect to server. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]); // Only depend on userId, not functions that change on every render

  const handleRetry = () => {
    console.log('Manual retry triggered');
    setError(null);
    setLoading(true);
    
    // Simple connectivity test first
    fetch('http://localhost:5001/api/books?limit=1')
      .then(response => {
        console.log('Basic connectivity test:', response.status);
        if (response.ok) {
          console.log('Backend is responding, retrying orders...');
          // Just reload the page to trigger fresh API call
          window.location.reload();
        } else {
          setLoading(false);
          setError('Backend server is not responding properly');
        }
      })
      .catch(error => {
        console.error('Connectivity test failed:', error);
        setLoading(false);
        setError('Cannot connect to backend server. Please check if it is running on port 5001.');
      });
  };

  // If no userId, show login prompt immediately
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-teal-600" />
            My Orders
          </h1>
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Please login to view your orders</p>
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  const createTestUser = async () => {
    try {
      // Create test user
      const signupResponse = await fetch('http://localhost:5001/api/users/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fullname: 'Test User',
          email: 'test@bookspot.com', 
          password: '123456'
        })
      });
      
      // Login with test user
      const loginResponse = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: 'test@bookspot.com',
          password: '123456'
        })
      });
      
      const loginData = await loginResponse.json();
      if (loginData.user) {
        localStorage.setItem('userId', loginData.user._id);
        localStorage.setItem('userName', loginData.user.fullname);
        localStorage.setItem('userEmail', loginData.user.email);
        window.location.reload(); // Reload to use new userId
      }
    } catch (error) {
      setError('Failed to create test user');
    }
  };

  // Show error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-teal-600" />
            My Orders
          </h1>
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-red-400 mb-4" />
            <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</p>
            {error === 'Invalid session. Please login again.' ? (
              <>
                <Link 
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors mr-4"
                >
                  Go to Login
                </Link>
                <button 
                  onClick={createTestUser}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
                >
                  Create Test User
                </button>
                <Link 
                  to="/books" 
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Browse Books
                </Link>
              </>
            ) : (
              <>
                <button 
                  onClick={handleRetry}
                  className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors mr-4"
                >
                  Try Again
                </button>
                <Link 
                  to="/books" 
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Browse Books
                </Link>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-teal-600" />
            My Orders
          </h1>
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <Loader />
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading your orders...</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-2">
          <ShoppingCart className="text-teal-600" />
          My Orders
        </h1>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No orders yet</p>
              <Link 
                to="/books" 
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              // Safely handle order object
              if (!order || typeof order !== 'object') {
                return null;
              }
              
              return (
                <div key={order.orderId || order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                      <p className="font-mono font-semibold dark:text-white">{order.orderId || order._id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || 'pending')}`}>
                      {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                      <p className="dark:text-white">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
                      <p className="dark:text-white">{order.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                      <p className="font-semibold dark:text-white">₹{(order.totalAmount || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                      <p className="dark:text-white">{order.paymentMethod || 'COD'}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Items ({order.items?.length || 0})</p>
                    <div className="space-y-2">
                      {(order.items || []).map((item, idx) => {
                        // Safely handle item object
                        if (!item || typeof item !== 'object') {
                          return (
                            <div key={idx} className="text-sm dark:text-gray-300 text-red-500">
                              Invalid item data
                            </div>
                          );
                        }
                        
                        return (
                          <div key={idx} className="text-sm dark:text-gray-300">
                            {/* Handle both populated bookId object and simple bookName string */}
                            {typeof item.bookId === 'object' && item.bookId?.name 
                              ? `${item.bookId.name} × ${item.quantity || 1} - ₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
                              : `${item.bookName || 'Unknown Book'} × ${item.quantity || 1} - ₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
                            }
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Address</p>
                      <p className="dark:text-white">{String(order.shippingAddress)}</p>
                    </div>
                  )}

                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.orderId || order._id)}
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Orders;
