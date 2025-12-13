import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { DeleteConfirmation } from '../common/DeleteConfirmation';

export function BooksList({ books, onDelete }) {
  const [deleteId, setDeleteId] = useState(null);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Added Books</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No books have been added yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={book.coverUrl}
                          alt={book.name}
                          className="h-12 w-9 object-cover rounded"
                        />
                        <span className="ml-4 font-medium dark:text-white">
                          {book.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      {book.authorName}
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      {book.genre.join(', ')}
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      ${book.price}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteId(book._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 
                                 dark:hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
