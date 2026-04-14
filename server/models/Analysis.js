const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        default: 'Unknown'
    },
    jobDescription: {
        type: String,
        required: true
    },
    userSkills: {
        type: [String],
        required: true
    },
    matchScore: {
        type: Number,
        default: 0
    },
    missingSkills: {
        type: [String],
        default: []
    },
    resumeTips: {
        type: [String],
        default: []
    },
    salaryRange: {
        type: String,
        default: ''
    },
    jobLevel: {
        type: String,
        enum: ['Junior', 'Mid', 'Senior'],
        default: 'Junior'
    }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);