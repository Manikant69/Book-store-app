import SiteSettings from '../model/siteSettings.model.js';

// Get site settings
const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = new SiteSettings();
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings'
    });
  }
};

// Update contact information
const updateContactInfo = async (req, res) => {
  try {
    const { email, phone, address } = req.body;
    
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }
    
    if (email) settings.email = email;
    if (phone) settings.phone = phone;
    if (address) settings.address = address;
    
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'Contact information updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact information'
    });
  }
};

// Update social links
const updateSocialLinks = async (req, res) => {
  try {
    const { facebook, twitter, instagram, youtube } = req.body;
    
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }
    
    if (facebook !== undefined) settings.socialLinks.facebook = facebook;
    if (twitter !== undefined) settings.socialLinks.twitter = twitter;
    if (instagram !== undefined) settings.socialLinks.instagram = instagram;
    if (youtube !== undefined) settings.socialLinks.youtube = youtube;
    
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'Social links updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update social links'
    });
  }
};

// Update all settings
const updateAllSettings = async (req, res) => {
  try {
    const updateData = req.body;
    
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(updateData);
    } else {
      Object.assign(settings, updateData);
    }
    
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

export {
  getSiteSettings,
  updateContactInfo,
  updateSocialLinks,
  updateAllSettings
};