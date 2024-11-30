require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');
const config = require('./config/config');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store risk data
const riskData = new Map();

// Securely access environment variables
const credentials = {
    appId: process.env.ZENDESK_APP_ID,
    keyId: process.env.ZENDESK_KEY_ID,
    secretKey: process.env.ZENDESK_SECRET_KEY,
    subdomain: process.env.ZENDESK_SUBDOMAIN
};

// Create Base64 encoded credentials
const base64Credentials = Buffer.from(`${credentials.keyId}/token:${credentials.secretKey}`).toString('base64');

// API Routes from routes.js
app.use('/api', routes);

// Legacy API endpoint (keeping for backwards compatibility)
app.get('/api/ticket/:ticketId', async (req, res) => {
    try {
        const { ticketId } = req.params;
        console.log('Received request for ticket:', ticketId);
        
        const response = await fetch(
            `https://${credentials.subdomain}.zendesk.com/api/v2/tickets/${ticketId}/comments`,
            {
                headers: {
                    'Authorization': `Basic ${base64Credentials}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            console.log('Zendesk API error:', response.status);
            throw new Error(`Zendesk API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Number of comments processed:', data.comments.length);
        console.log('Ticket data:', data);

        const riskScore = await processComments(data.comments);
        
        res.json({
            ticketId,
            riskScore,
            comments: data.comments
        });

    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ error: error.message });
    }
});

// Process comments and calculate risk
async function processComments(comments) {
    let riskScore = 0;
    const triggers = {
        highRisk: ['chargeback', 'fair credit billing act', 'attorney'],
        mediumRisk: ['refund', 'return', 'not received'],
        lowRisk: ['where', 'status', 'tracking']
    };

    comments.forEach(comment => {
        const text = comment.body.toLowerCase();
        
        triggers.highRisk.forEach(phrase => {
            if (text.includes(phrase)) {
                riskScore = Math.max(riskScore, 85);
            }
        });

        triggers.mediumRisk.forEach(phrase => {
            if (text.includes(phrase)) {
                riskScore = Math.max(riskScore, 50);
            }
        });

        triggers.lowRisk.forEach(phrase => {
            if (text.includes(phrase)) {
                riskScore = Math.max(riskScore, 25);
            }
        });
    });

    return riskScore;
}

// Monitor ticket comments
async function monitorTicketComments(ticketId) {
    try {
        const response = await fetch(
            `https://${credentials.subdomain}.zendesk.com/api/v2/tickets/${ticketId}/comments.json`,
            {
                headers: {
                    'Authorization': `Basic ${base64Credentials}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = await response.json();
        console.log('Comments retrieved:', data.comments.length);

        data.comments.forEach(comment => {
            const text = comment.body.toLowerCase();
            
            if (text.includes('chargeback')) {
                console.log('Chargeback threat detected');
                updateRiskScore(68);
            }
        });

        return data;

    } catch (error) {
        console.error('Error monitoring comments:', error);
        throw error;
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        app_id: credentials.appId
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Health check available at http://localhost:${port}/health`);
});

module.exports = app;
