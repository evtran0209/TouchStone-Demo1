require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// You can verify the environment variables are loaded by adding:
console.log('Environment loaded:', {
    subdomain: process.env.ZENDESK_SUBDOMAIN,
    apiVersion: process.env.API_VERSION
});

// Simplified triggers
const triggers = {
    identity: [
        { phrase: "chargeback", text: "Chargeback Threat Detected", score: 85, level: "high" }
    ]
};

app.use(cors({
    origin: [
        'https://americaneagleoutfittersinchelp.zendesk.com',
        'https://1087707.apps.zdusercontent.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Simple analyze endpoint
app.post('/api/analyze', (req, res) => {
    try {
        console.log('Received request:', req.body);
        const { comment } = req.body;
        
        if (!comment) {
            console.log('No comment provided');
            return res.status(400).json({ error: 'Comment is required' });
        }

        console.log('Analyzing comment:', comment);
        const results = [];
        
        if (comment.toLowerCase().includes('chargeback')) {
            results.push({
                message: "Chargeback Threat Detected",
                level: "high",
                score: 85
            });
        }

        console.log('Analysis results:', results);
        res.json({ risks: results });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
