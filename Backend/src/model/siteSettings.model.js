import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  // Contact Information
  email: {
    type: String,
    default: 'support@bookspot.com'
  },
  phone: {
    type: String,
    default: '+91-9876543210'
  },
  address: {
    type: String,
    default: '123 Book Street, Library City, India - 110001'
  },
  
  // Social Links
  socialLinks: {
    facebook: {
      type: String,
      default: 'https://facebook.com/bookspot'
    },
    twitter: {
      type: String,
      default: 'https://twitter.com/bookspot'
    },
    instagram: {
      type: String,
      default: 'https://instagram.com/bookspot'
    },
    youtube: {
      type: String,
      default: 'https://youtube.com/bookspot'
    }
  },
  
  // Site Information
  siteName: {
    type: String,
    default: 'BookSpot'
  },
  siteDescription: {
    type: String,
    default: 'Your one-stop destination for books'
  }
}, {
  timestamps: true
});

export default mongoose.model('SiteSettings', siteSettingsSchema);