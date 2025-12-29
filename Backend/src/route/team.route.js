import express from 'express';
import { 
    getAllTeamMembers, 
    getPublicTeamMembers,
    createTeamMember, 
    updateTeamMember, 
    deleteTeamMember 
} from '../controller/team.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

// Public route to get team members for frontend display
router.get('/public', getPublicTeamMembers);

// Admin routes for team management
router.get('/', getAllTeamMembers);
router.post('/', upload.single('image'), createTeamMember);
router.put('/:id', upload.single('image'), updateTeamMember);
router.delete('/:id', deleteTeamMember);

export default router;