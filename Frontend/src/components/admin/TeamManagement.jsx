import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, UserPlus, ExternalLink, Github, Linkedin, Users, Upload, X } from 'lucide-react';
import Toast from '../../utils/toast';
import { TEAM_API_END_POINT } from '../../utils/constants';

export function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tech: '',
    bio: '',
    image: '',
    linkedinLink: '',
    githubLink: '',
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, [searchTerm]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${TEAM_API_END_POINT}?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.teamMembers || []);
      } else {
        Toast.error(data.message || 'Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      Toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // For now, let's handle image upload through the team creation endpoint
      // You can configure Cloudinary directly in frontend if needed
      return null; // Will be handled by the backend
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('tech', formData.tech);
      submitFormData.append('bio', formData.bio);
      submitFormData.append('linkedinLink', formData.linkedinLink);
      submitFormData.append('githubLink', formData.githubLink);
      submitFormData.append('order', formData.order.toString());
      
      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      const url = editingMember 
        ? `${TEAM_API_END_POINT}/${editingMember._id}`
        : TEAM_API_END_POINT;
      
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: submitFormData
      });

      const data = await response.json();
      
      if (data.success) {
        Toast.success(editingMember ? 'Team member updated successfully' : 'Team member created successfully');
        fetchTeamMembers();
        resetForm();
      } else {
        Toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      Toast.error('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await fetch(`${TEAM_API_END_POINT}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        Toast.success('Team member deleted successfully');
        fetchTeamMembers();
      } else {
        Toast.error(data.message || 'Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      Toast.error('Failed to delete team member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      tech: member.tech,
      bio: member.bio,
      image: member.image,
      linkedinLink: member.linkedinLink || '',
      githubLink: member.githubLink || '',
      order: member.order || 0
    });
    setImagePreview(member.image);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tech: '',
      bio: '',
      image: '',
      linkedinLink: '',
      githubLink: '',
      order: 0
    });
    setImageFile(null);
    setImagePreview('');
    setEditingMember(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Team Members List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member._id} className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1.5 bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 rounded-lg shadow-sm transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="p-1.5 bg-white/90 hover:bg-white text-red-600 hover:text-red-700 rounded-lg shadow-sm transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{member.name}</h3>
                  {member.order && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                      #{member.order}
                    </span>
                  )}
                </div>
                <p className="text-teal-600 dark:text-teal-400 font-medium text-sm uppercase tracking-wider mb-3 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md inline-block">
                  {member.tech}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex space-x-2">
                    {member.linkedinLink && (
                      <a 
                        href={member.linkedinLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 transform hover:scale-110"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.githubLink && (
                      <a 
                        href={member.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white rounded-lg transition-all duration-200 transform hover:scale-110"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {teamMembers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No team members found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by adding your first team member.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Technology/Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tech}
                    onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Image *
                </label>
                {imagePreview && (
                  <div className="mb-2">
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingMember}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinLink}
                    onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
                >
                  {editingMember ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}