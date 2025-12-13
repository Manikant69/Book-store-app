import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/settings';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch site settings
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL);
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update contact information
  const updateContactInfo = async (contactData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/contact`, contactData);
      if (response.data.success) {
        setSettings(response.data.settings);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update contact information';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update social links
  const updateSocialLinks = async (socialData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/social`, socialData);
      if (response.data.success) {
        setSettings(response.data.settings);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update social links';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update all settings
  const updateAllSettings = async (settingsData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(API_BASE_URL, settingsData);
      if (response.data.success) {
        setSettings(response.data.settings);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update settings';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateContactInfo,
    updateSocialLinks,
    updateAllSettings
  };
};