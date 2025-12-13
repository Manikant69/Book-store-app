import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import {BookProvider} from './context/BookContext';
import Home from './pages/Home';
import BrowseBooks from './pages/BrowseBooks';
import AddBooks from './pages/AddBooks';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { CartSidebar } from './components/cart/CartSidebar';
import axios from 'axios';
import { BOOK_API_END_POINT } from './utils/constants';

const App = () => {

  const [books, setBooks] =  useState([]);

  const addBook = (book)=>{
    setBooks((prev) => [book, ...prev]);
  }

  const deleteBook = (id)=>{
    setBooks((prev) => prev.filter((book) => book._id !== id));
  }
  
  useEffect(()=>{
    async function fetchData(){
      const res = await axios.get(`${BOOK_API_END_POINT}`);

      if(res){
        setBooks(res.data.books);
      }
    }

    fetchData();

  }, [])

  return (
    <CartProvider>
    <BookProvider value={{books, addBook, deleteBook}}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BrowseBooks />} />
          <Route path="/add" element={<AddBooks />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <CartSidebar />
      </Router>
    </BookProvider>
    </CartProvider>
  );
};

export default App;
