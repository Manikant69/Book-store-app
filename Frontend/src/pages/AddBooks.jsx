import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { AddBookForm } from '../components/books/AddBookForm';
import { BooksList } from '../components/books/BooksList';
import { Footer } from '../components/layout/Footer';
import { useBook } from '../context/BookContext';
import Toast from '../utils/toast';

function AddBooks() {
  const {books, addBook, deleteBook} = useBook();
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
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Add New Book</h1>
        <AddBookForm onSubmit={addBook} />
        <BooksList books={books} onDelete={deleteBook} />
      </main>
      <Footer />
    </div>
  );
}

export default AddBooks;