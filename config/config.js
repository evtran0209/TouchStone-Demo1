require('dotenv').config();

const config = {
    zendesk: {
        credentials: {
            appId: process.env.ZENDESK_APP_ID,
            keyId: process.env.ZENDESK_KEY_ID,
            secretKey: process.env.ZENDESK_SECRET_KEY,
            subdomain: process.env.ZENDESK_SUBDOMAIN,
            token: Buffer.from(`${process.env.ZENDESK_KEY_ID}/token:${process.env.ZENDESK_SECRET_KEY}`).toString('base64')
        },
        api: {
            version: 'v2',
            baseUrl: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`
        }
    },
    app: {
        riskThresholds: {
            high: 85,
            medium: 50,
            low: 25
        },
        triggers: {
            highRisk: ['chargeback', 'fair credit billing act', 'attorney'],
            mediumRisk: ['refund', 'return', 'not received'],
            lowRisk: ['where', 'status', 'tracking']
        }
    }
};

module.exports = config;