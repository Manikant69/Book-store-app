import React, { useState, useEffect } from 'react';
import { Upload, Plus } from 'lucide-react';
import { useGenres } from '../../hooks/useApi';
import { BOOK_API_END_POINT } from '../../utils/constants';
import axios from 'axios'

export function AddBookForm({ onSubmit }) {
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const { getGenres } = useGenres();
  
  const [formData, setFormData] = useState({
    name: '',
    authorName: '',
    genre: [],
    price: '',
    publishYear: '',
    coverImage: '',
    description: '',
    language: 'English',
  });

  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      const result = await getGenres();
      if (result && result.success) {
        setGenres(result.genres || []);
      }
      setLoadingGenres(false);
    };

    fetchGenres();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("authorName", formData.authorName);
    form.append("genre", JSON.stringify(formData.genre));
    form.append("price", Number(formData.price));
    form.append("publishYear", Number(formData.publishYear));
    form.append("rating", 0);
    form.append("inStock", true);
    form.append("description", formData.description);
    form.append("language", formData.language);
    form.append("coverImage", formData.coverImage);


    try {

      const res = await axios.post(`${BOOK_API_END_POINT}/add`,
        form,
        {
          headers:{
            "Content-Type":"multipart/form-data",
        }}
      );
      console.log("data fetched successfully");
      console.log(res);
      
    } catch (error) {
      console.log("Error:", error);
    }
    setFormData({
      name: '',
      authorName: '',
      genre: [],
      price: '',
      publishYear: '',
      coverImage: '',
      description: '',
      language: 'English',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Book Title
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author Name
          </label>
          <input
            type="text"
            required
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Genre
          </label>
          <select
            multiple
            value={formData.genre}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              setFormData({ ...formData, genre: values });
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select a genre</option>
            {loadingGenres ? (
              <option disabled>Loading genres...</option>
            ) : (
              genres.map((genre) => (
                <option key={genre._id} value={genre.name}>
                  {genre.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Publish Year
          </label>
          <input
            type="number"
            required
            min="1800"
            max={new Date().getFullYear()}
            value={formData.publishYear}
            onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Image
          </label>
          <div className="flex gap-2">
            <input
              type="file"
              required
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.files?.[0] })}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                       dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <Upload className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                   transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Book
        </button>
      </div>
    </form>
  );
}
