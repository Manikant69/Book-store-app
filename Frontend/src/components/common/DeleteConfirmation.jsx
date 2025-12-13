import { AlertTriangle } from 'lucide-react';

export function DeleteConfirmation({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold dark:text-white">
            Delete Confirmation
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this book? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                     dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                     transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
