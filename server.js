require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 0 : 3000;

// Risk analysis triggers
const triggers = {
    identity: [
        { phrase: "don't have it handy", score: 23, level: "low" },
        { phrase: "can't you find it", score: 36, level: "medium" }
    ],
    behavior: [
        { phrase: "rush", score: 36, level: "medium" },
        { phrase: "chargeback", score: 68, level: "high" },
        { phrase: "fair credit billing act", score: 85, level: "high" }
    ],
    delivery: [
        { phrase: "impossible", score: 54, level: "medium" },
        { phrase: "nothing came", score: 36, level: "medium" }
    ]
};

// Risk analysis functions
function calculateRiskScore(comment) {
    const text = comment.toLowerCase();
    let maxScore = 0;

    Object.values(triggers).forEach(category => {
        category.forEach(trigger => {
            if (text.includes(trigger.phrase.toLowerCase())) {
                maxScore = Math.max(maxScore, trigger.score);
            }
        });
    });

    return maxScore;
}

function analyzeIdentityRisks(comment) {
    const text = comment.toLowerCase();
    return triggers.identity
        .filter(trigger => text.includes(trigger.phrase.toLowerCase()))
        .map(trigger => ({
            message: `Identity Risk: ${trigger.phrase}`,
            level: trigger.level,
            score: trigger.score
        }));
}

function analyzeBehaviorRisks(comment) {
    const text = comment.toLowerCase();
    return triggers.behavior
        .filter(trigger => text.includes(trigger.phrase.toLowerCase()))
        .map(trigger => ({
            message: `Behavior Risk: ${trigger.phrase}`,
            level: trigger.level,
            score: trigger.score
        }));
}

function analyzeDeliveryRisks(comment) {
    const text = comment.toLowerCase();
    return triggers.delivery
        .filter(trigger => text.includes(trigger.phrase.toLowerCase()))
        .map(trigger => ({
            message: `Delivery Risk: ${trigger.phrase}`,
            level: trigger.level,
            score: trigger.score
        }));
}

// Middleware
app.use(cors({
    origin: [
        'https://americaneagleoutfittersinchelp.zendesk.com',
        'https://1087707.apps.zdusercontent.com',
        'https://*.zendesk.com',
        'https://*.zdassets.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Zendesk-App-Token']
}));
app.use(express.json());

// Serve static files with CORS headers
app.use('/dist', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    express.static(path.join(__dirname, 'dist'))(req, res, next);
});

app.use('/assets', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    express.static(path.join(__dirname, 'assets'))(req, res, next);
});

// Updated risk analysis endpoint with CORS handling
app.options('/api/analyze', cors());
app.post('/api/analyze', cors(), (req, res) => {
    try {
        const { comment } = req.body;
        console.log('Analyzing comment:', comment);

        const result = {
            riskScore: calculateRiskScore(comment),
            identityRisks: analyzeIdentityRisks(comment),
            behaviorRisks: analyzeBehaviorRisks(comment),
            deliveryRisks: analyzeDeliveryRisks(comment)
        };

        console.log('Analysis result:', result);
        res.json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

// Basic ticket update endpoint with CORS handling
app.options('/api/ticket/update', cors());
app.post('/api/ticket/update', cors(), (req, res) => {
    try {
        const { ticketId, comment } = req.body;
        res.json({ 
            success: true,
            ticketId,
            message: 'Ticket updated successfully'
        });
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint with CORS handling
app.options('/health', cors());
app.get('/health', cors(), (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

let server;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = { 
    app, 
    server,
    calculateRiskScore,
    analyzeIdentityRisks,
    analyzeBehaviorRisks,
    analyzeDeliveryRisks
};
