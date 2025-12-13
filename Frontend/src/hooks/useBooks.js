import { useState, useEffect } from 'react';
import { MOCK_BOOKS } from '../data/mockBooks';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const loadBooks = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBooks(MOCK_BOOKS);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  const addBook = (newBook) => {
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const deleteBook = (id) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  return {
    books,
    isLoading,
    error,
    addBook,
    deleteBook
  };
}
