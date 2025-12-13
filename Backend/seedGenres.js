import mongoose from 'mongoose';
import Genre from './src/model/genre.model.js';
import { DB_URI } from './src/constants.js';

const seedGenres = async () => {
    try {
        // Connect to database
        await mongoose.connect(DB_URI);
        console.log('Connected to database');

        // Check if genres already exist
        const existingGenres = await Genre.countDocuments();
        if (existingGenres > 0) {
            console.log('Genres already exist. Skipping seed.');
            return;
        }

        // Initial genres to seed
        const genres = [
            { name: 'Fiction', description: 'Literary fiction and novels' },
            { name: 'Mystery', description: 'Mystery and thriller books' },
            { name: 'Romance', description: 'Romantic fiction and love stories' },
            { name: 'Science Fiction', description: 'Sci-fi and futuristic stories' },
            { name: 'Fantasy', description: 'Fantasy and magical realism' },
            { name: 'Biography', description: 'Biographies and memoirs' },
            { name: 'History', description: 'Historical books and accounts' },
            { name: 'Self-Help', description: 'Self-improvement and personal development' },
            { name: 'Business', description: 'Business and entrepreneurship' },
            { name: 'Health', description: 'Health and wellness books' },
            { name: 'Technology', description: 'Technology and computer science' },
            { name: 'Psychology', description: 'Psychology and behavioral science' }
        ];

        // Insert genres
        await Genre.insertMany(genres);
        console.log('✅ Genres seeded successfully!');
        console.log(`📚 Added ${genres.length} genres to the database`);

    } catch (error) {
        console.error('❌ Error seeding genres:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
};

seedGenres();