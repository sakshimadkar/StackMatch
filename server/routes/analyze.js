const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Analysis = require('../models/Analysis');
const { analyzeJob } = require('../services/ai');

// Middleware — token verify कर
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token, access denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Job analyze करा
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { jobDescription, userSkills } = req.body;

        // AI ने analyze कर
        const result = await analyzeJob(jobDescription, userSkills);

        // MongoDB मध्ये save कर
        const analysis = new Analysis({
            userId: req.userId,
            jobDescription,
            userSkills,
            jobTitle: result.jobTitle,
            matchScore: result.matchScore,
            missingSkills: result.missingSkills,
            resumeTips: result.resumeTips,
            salaryRange: result.salaryRange,
            jobLevel: result.jobLevel
        });

        await analysis.save();

        res.json({ success: true, result });

    } catch (error) {
        console.log('Analyze error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// History fetch करा
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const analyses = await Analysis.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({ success: true, analyses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// History delete करा
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Analysis.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;