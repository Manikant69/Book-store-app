import axios from 'axios';
import Toast from '../utils/toast';
import { USER_API_END_POINT, BOOK_API_END_POINT, ORDER_API_END_POINT, GENRE_API_END_POINT } from '../utils/constants';

export const useAdmin = () => {
  // User Management
  const getAllUsers = async (filters = {}) => {
    try {
      let url = `${USER_API_END_POINT}/admin/all?`;
      if (filters.search) url += `search=${encodeURIComponent(filters.search)}&`;
      if (filters.role) url += `role=${filters.role}&`;
      if (filters.page) url += `page=${filters.page}&`;
      if (filters.limit) url += `limit=${filters.limit}&`;
      
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error fetching users');
      return null;
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const res = await axios.put(`${USER_API_END_POINT}/admin/${userId}/role`, { role });
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error updating user role');
      return null;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await axios.delete(`${USER_API_END_POINT}/admin/${userId}`);
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error deleting user');
      return null;
    }
  };

  // Books Management
  const getAllBooksAdmin = async (filters = {}) => {
    try {
      let url = `${BOOK_API_END_POINT}/admin/all?`;
      if (filters.search) url += `search=${encodeURIComponent(filters.search)}&`;
      if (filters.genre) url += `genre=${filters.genre}&`;
      if (filters.page) url += `page=${filters.page}&`;
      if (filters.limit) url += `limit=${filters.limit}&`;
      
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error fetching books');
      return null;
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const res = await axios.delete(`${BOOK_API_END_POINT}/delete/${bookId}`);
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error deleting book');
      return null;
    }
  };

  // Orders Management
  const getAllOrders = async (filters = {}) => {
    try {
      let url = `${ORDER_API_END_POINT}/admin/all?`;
      if (filters.status) url += `status=${filters.status}&`;
      if (filters.search) url += `search=${encodeURIComponent(filters.search)}&`;
      if (filters.page) url += `page=${filters.page}&`;
      if (filters.limit) url += `limit=${filters.limit}&`;
      
      console.log('Making orders API call to:', url);
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error('Orders API Error:', error);
      Toast.error(error.response?.data?.message || 'Error fetching orders');
      return null;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.put(`${ORDER_API_END_POINT}/admin/${orderId}/status`, { status });
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error updating order status');
      return null;
    }
  };

  // Genres Management
  const addGenre = async (genreData) => {
    try {
      const res = await axios.post(`${GENRE_API_END_POINT}`, genreData);
      Toast.success('Genre added successfully');
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error adding genre');
      return null;
    }
  };

  const updateGenre = async (genreId, genreData) => {
    try {
      const res = await axios.put(`${GENRE_API_END_POINT}/${genreId}`, genreData);
      Toast.success('Genre updated successfully');
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error updating genre');
      return null;
    }
  };

  const deleteGenre = async (genreId) => {
    try {
      const res = await axios.delete(`${GENRE_API_END_POINT}/${genreId}`);
      Toast.success('Genre deleted successfully');
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error deleting genre');
      return null;
    }
  };

  // Dashboard Stats
  const getAdminStats = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/admin/stats`);
      return res.data;
    } catch (error) {
      Toast.error('Error fetching admin statistics');
      return null;
    }
  };

  // Genre Management
  const getAllGenres = async () => {
    try {
      const res = await axios.get(`${GENRE_API_END_POINT}`);
      console.log('Genres API response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      Toast.error(error.response?.data?.message || 'Error fetching genres');
      return { success: false, genres: [] };
    }
  };

  return {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllBooksAdmin,
    deleteBook,
    getAllOrders,
    updateOrderStatus,
    getAllGenres,
    addGenre,
    updateGenre,
    deleteGenre,
    getAdminStats
  };
};