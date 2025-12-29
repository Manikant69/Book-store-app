import mongoose from 'mongoose';
import Team from './src/model/team.model.js';
import { DB_NAME } from './src/constants.js';

const seedTeam = async () => {
    try {
        // Connect to database
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('Connected to database');

        // Check if team members already exist
        const existingTeamMembers = await Team.countDocuments();
        if (existingTeamMembers > 0) {
            console.log('Team members already exist. Skipping seed.');
            return;
        }

        // Initial team members to seed
        const teamMembers = [
            {
                name: 'Sarah Chen',
                tech: 'Lead Developer',
                bio: 'Passionate about creating seamless reading experiences with 8+ years in full-stack development.',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
                linkedinLink: 'https://linkedin.com/in/sarah-chen',
                githubLink: 'https://github.com/sarahchen',
                order: 1
            },
            {
                name: 'Alex Rivera',
                tech: 'UI/UX Designer',
                bio: 'Crafting beautiful interfaces for book lovers. Specialized in user-centered design and accessibility.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                linkedinLink: 'https://linkedin.com/in/alex-rivera',
                githubLink: 'https://github.com/alexrivera',
                order: 2
            },
            {
                name: 'Emily Watson',
                tech: 'Content Curator',
                bio: 'Finding the best books for our readers. Literature enthusiast with expertise in book recommendations.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
                linkedinLink: 'https://linkedin.com/in/emily-watson',
                githubLink: '',
                order: 3
            }
        ];

        // Insert team members
        await Team.insertMany(teamMembers);
        console.log('✅ Team members seeded successfully!');
        console.log(`👥 Added ${teamMembers.length} team members to the database`);

    } catch (error) {
        console.error('❌ Error seeding team members:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
};

seedTeam();