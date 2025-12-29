import mongoose from "mongoose";

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tech: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    linkedinLink: {
        type: String,
        default: ""
    },
    githubLink: {
        type: String,
        default: ""
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

export default Team;