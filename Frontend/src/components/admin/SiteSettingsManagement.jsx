import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Settings, Save, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Toast from '../../utils/toast';

export function SiteSettingsManagement() {
  const { settings, loading, updateContactInfo, updateSocialLinks } = useSiteSettings();
  const [contactForm, setContactForm] = useState({
    email: '',
    phone: '',
    address: ''
  });
  const [socialForm, setSocialForm] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: ''
  });
  const [activeSection, setActiveSection] = useState('contact');

  useEffect(() => {
    if (settings) {
      setContactForm({
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || ''
      });
      setSocialForm({
        facebook: settings.socialLinks?.facebook || '',
        twitter: settings.socialLinks?.twitter || '',
        instagram: settings.socialLinks?.instagram || '',
        youtube: settings.socialLinks?.youtube || ''
      });
    }
  }, [settings]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const result = await updateContactInfo(contactForm);
    if (result.success) {
      Toast.success(result.message);
    } else {
      Toast.error(result.message);
    }
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    const result = await updateSocialLinks(socialForm);
    if (result.success) {
      Toast.success(result.message);
    } else {
      Toast.error(result.message);
    }
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialChange = (e) => {
    setSocialForm({
      ...socialForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h2>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveSection('contact')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'contact'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Contact Information
          </button>
          <button
            onClick={() => setActiveSection('social')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'social'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Social Links
          </button>
        </nav>
      </div>

      {/* Contact Information Section */}
      {activeSection === 'contact' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Information
          </h3>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                placeholder="support@bookspot.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={contactForm.phone}
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                placeholder="+91-9876543210"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Address
              </label>
              <textarea
                name="address"
                value={contactForm.address}
                onChange={handleContactChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                placeholder="123 Book Street, Library City, India - 110001"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-700 focus:outline-none focus:border-teal-900 focus:ring ring-teal-300 disabled:opacity-25 transition ease-in-out duration-150"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Contact Info'}
            </button>
          </form>
        </div>
      )}

      {/* Social Links Section */}
      {activeSection === 'social' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Social Media Links
          </h3>
          <form onSubmit={handleSocialSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Facebook className="h-4 w-4 inline mr-2" />
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={socialForm.facebook}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://facebook.com/bookspot"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Twitter className="h-4 w-4 inline mr-2" />
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={socialForm.twitter}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://twitter.com/bookspot"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Instagram className="h-4 w-4 inline mr-2" />
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={socialForm.instagram}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://instagram.com/bookspot"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Youtube className="h-4 w-4 inline mr-2" />
                YouTube
              </label>
              <input
                type="url"
                name="youtube"
                value={socialForm.youtube}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://youtube.com/bookspot"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-700 focus:outline-none focus:border-teal-900 focus:ring ring-teal-300 disabled:opacity-25 transition ease-in-out duration-150"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Social Links'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}