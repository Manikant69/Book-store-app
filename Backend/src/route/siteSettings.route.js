import express from 'express';
import { 
  getSiteSettings, 
  updateContactInfo, 
  updateSocialLinks, 
  updateAllSettings 
} from '../controller/siteSettings.controller.js';

const router = express.Router();

// GET /api/settings - Get all site settings
router.get('/', getSiteSettings);

// PUT /api/settings/contact - Update contact information
router.put('/contact', updateContactInfo);

// PUT /api/settings/social - Update social links
router.put('/social', updateSocialLinks);

// PUT /api/settings - Update all settings
router.put('/', updateAllSettings);

export default router;