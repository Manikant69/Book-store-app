import { useState, useEffect } from 'react';
import axios from 'axios';
import { GENRE_API_END_POINT } from '../utils/constants';

const API_BASE_URL = GENRE_API_END_POINT;

export const usePopularGenres = (limit = 6) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopularGenres = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/popular?limit=${limit}`);
      if (response.data.success) {
        setGenres(response.data.genres);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch popular genres');
      console.error('Error fetching popular genres:', err);
      // Fallback to empty array if API fails
      setGenres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularGenres();
  }, [limit]);

  return {
    genres,
    loading,
    error,
    refetch: fetchPopularGenres
  };
};