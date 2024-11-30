const testConfig = {
    zendesk: {
        credentials: {
            appId: 'test-app-id',
            keyId: 'test-key-id',
            secretKey: 'test-secret',
            subdomain: 'test-subdomain',
            token: 'test-token'
        },
        api: {
            version: 'v2',
            baseUrl: 'http://localhost:3000/api/v2'
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

module.exports = testConfig;