import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Loader } from '../common/Loader';

export function CartSidebar() {
  const { state, dispatch, updateQuantity, removeFromCart } = useCart();
  
  const totalPrice = state.total || state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(id);
      return;
    }
    await updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = async (id) => {
    await removeFromCart(id);
  };

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-semibold dark:text-white">Shopping Cart</h2>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({state.items.length} items)
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader />
              </div>
            ) : state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <img
                      src={item.coverImage || item.coverUrl}
                      alt={item.name || item.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold dark:text-white">{item.name || item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {item.authorName || item.author}
                      </p>
                      <p className="text-teal-600 dark:text-teal-400 font-semibold mt-1">
                        ₹{item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id || item._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          disabled={state.itemLoading[item.id || item._id]}
                        >
                          <Minus className={`h-4 w-4 ${state.itemLoading[item.id || item._id] ? 'opacity-50' : ''}`} />
                        </button>
                        <span className={`w-8 text-center dark:text-white transition-opacity ${state.itemLoading[item.id || item._id] ? 'opacity-50' : ''}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id || item._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          disabled={state.itemLoading[item.id || item._id]}
                        >
                          <Plus className={`h-4 w-4 ${state.itemLoading[item.id || item._id] ? 'opacity-50' : ''}`} />
                        </button>
                        {state.itemLoading[item.id || item._id] && (
                          <div className="ml-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id || item._id)}
                      className={`text-red-500 hover:text-red-600 p-1 transition-colors ${state.itemLoading[item.id || item._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={state.itemLoading[item.id || item._id]}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && !state.loading && (
            <div className="border-t dark:border-gray-700 p-4">
              <div className="flex justify-between mb-4">
                <span className="font-semibold dark:text-white">Total:</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <Link
                  to="/cart"
                  onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                  className="block w-full py-3 bg-teal-600 text-white text-center rounded-lg 
                           hover:bg-teal-700 transition-colors duration-200"
                >
                  View Cart
                </Link>
                <Link
                  to="/cart"
                  onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                  className="block w-full py-3 bg-gray-900 text-white text-center rounded-lg 
                           hover:bg-gray-800 transition-colors duration-200"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
