import Team from "../model/team.model.js";
import { PAGINATION_LIMITS } from "../utils/constants.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all team members
export const getAllTeamMembers = async (req, res) => {
    try {
        const { page = 1, limit = PAGINATION_LIMITS.DEFAULT, search = "" } = req.query;
        const skip = (page - 1) * limit;

        const query = search 
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { tech: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const teamMembers = await Team.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Team.countDocuments(query);

        res.status(200).json({
            success: true,
            teamMembers,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get public team members (for frontend display)
export const getPublicTeamMembers = async (req, res) => {
    try {
        const teamMembers = await Team.find()
            .sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            teamMembers
        });
    } catch (error) {
        console.error("Error fetching public team members:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Create a new team member
export const createTeamMember = async (req, res) => {
    try {
        const { name, tech, bio, linkedinLink, githubLink, order } = req.body;

        if (!name || !tech || !bio) {
            return res.status(400).json({
                success: false,
                message: "Name, tech, and bio are required fields"
            });
        }

        let imageUrl = "";
        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (cloudinaryResponse) {
                imageUrl = cloudinaryResponse.secure_url;
            }
        }

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const newTeamMember = new Team({
            name,
            tech,
            bio,
            image: imageUrl,
            linkedinLink: linkedinLink || "",
            githubLink: githubLink || "",
            order: order || 0
        });

        const savedTeamMember = await newTeamMember.save();

        res.status(201).json({
            success: true,
            message: "Team member created successfully",
            teamMember: savedTeamMember
        });
    } catch (error) {
        console.error("Error creating team member:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update a team member
export const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tech, bio, linkedinLink, githubLink, order } = req.body;

        const teamMember = await Team.findById(id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }

        let imageUrl = teamMember.image; // Keep existing image by default
        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (cloudinaryResponse) {
                imageUrl = cloudinaryResponse.secure_url;
            }
        }

        const updatedTeamMember = await Team.findByIdAndUpdate(
            id,
            {
                name,
                tech,
                bio,
                image: imageUrl,
                linkedinLink: linkedinLink || "",
                githubLink: githubLink || "",
                order: order || 0
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Team member updated successfully",
            teamMember: updatedTeamMember
        });
    } catch (error) {
        console.error("Error updating team member:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete a team member
export const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;

        const teamMember = await Team.findById(id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }

        await Team.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Team member deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting team member:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};