import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import Toast from '../../utils/toast';

export function GenresManagement() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGenre, setEditingGenre] = useState(null);
  const [newGenre, setNewGenre] = useState({ name: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const { getAllGenres, addGenre, updateGenre, deleteGenre } = useAdmin();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    console.log('Fetching genres...');
    const result = await getAllGenres();
    console.log('Genres result:', result);
    if (result && result.success) {
      setGenres(result.genres || []);
    } else {
      console.error('Failed to fetch genres:', result);
      setGenres([]);
    }
    setLoading(false);
  };

  const handleAddGenre = async () => {
    if (!newGenre.name.trim()) {
      Toast.error('Genre name is required');
      return;
    }

    const result = await addGenre(newGenre);
    if (result && result.success) {
      fetchGenres();
      setNewGenre({ name: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdateGenre = async (genreId, updatedData) => {
    const result = await updateGenre(genreId, updatedData);
    if (result && result.success) {
      fetchGenres();
      setEditingGenre(null);
    }
  };

  const handleDeleteGenre = async (genreId) => {
    if (window.confirm('Are you sure you want to delete this genre?')) {
      const result = await deleteGenre(genreId);
      if (result && result.success) {
        fetchGenres();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Genres Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Genre</span>
        </button>
      </div>

      {/* Add Genre Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Genre</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Genre Name *
              </label>
              <input
                type="text"
                value={newGenre.name}
                onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter genre name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newGenre.description}
                onChange={(e) => setNewGenre({ ...newGenre, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter description (optional)"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewGenre({ name: '', description: '' });
              }}
              className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleAddGenre}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1"
            >
              <Save className="h-4 w-4" />
              <span>Add Genre</span>
            </button>
          </div>
        </div>
      )}

      {/* Genres List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : genres.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No genres found</h3>
              <p className="text-sm">Get started by adding your first genre.</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
            >
              Add Your First Genre
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {genres.map((genre) => (
                  <tr key={genre._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingGenre === genre._id ? (
                        <input
                          type="text"
                          defaultValue={genre.name}
                          onChange={(e) => genre.name = e.target.value}
                          className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-teal-500 focus:outline-none"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {genre.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingGenre === genre._id ? (
                        <input
                          type="text"
                          defaultValue={genre.description || ''}
                          onChange={(e) => genre.description = e.target.value}
                          className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border-b border-teal-500 focus:outline-none w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {genre.description || 'No description'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        genre.isActive !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {genre.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(genre.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {editingGenre === genre._id ? (
                          <>
                            <button
                              onClick={() => {
                                handleUpdateGenre(genre._id, {
                                  name: genre.name,
                                  description: genre.description
                                });
                              }}
                              className="text-green-600 hover:text-green-900 dark:text-green-400"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingGenre(null)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingGenre(genre._id)}
                              className="text-teal-600 hover:text-teal-900 dark:text-teal-400"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGenre(genre._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}