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
            baseUrl: 'https://test-api.zendesk.com/v2',
            timeout: 5000
        },
        auth: {
            username: 'test-user',
            token: 'test-token'
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
    },
    riskAnalysis: {
        thresholds: {
            low: 30,
            medium: 60,
            high: 85
        },
        triggers: {
            chargeback: 85,
            'fair credit billing act': 85,
            'rush': 36,
            'impossible': 54
        }
    },
    testing: {
        mockResponses: true,
        logLevel: 'error'
    }
};

module.exports = testConfig;