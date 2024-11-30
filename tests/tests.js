const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
require('./setup');

const app = require('../scripts/app.js');

describe('Risk Assessment Tests', () => {
    beforeEach(() => {
        // Reset DOM elements
        document.getElementById('currentScore').textContent = '0%';
        document.getElementById('denyButton').style.display = 'none';
        
        // Clear bullet points
        document.querySelectorAll('.bullet-points').forEach(ul => {
            ul.innerHTML = '';
        });
    });

    it('should update risk score correctly', () => {
        app.updateRiskScore(85);
        expect(document.getElementById('currentScore').textContent).to.equal('85%');
    });

    it('should analyze comments correctly', async () => {
        const result = await app.analyzeComment({
            value: "I'll file a chargeback"
        });
        expect(result.riskScore).to.equal(85);
    });

    it('should add bullet points correctly', () => {
        const added = app.addBulletPoint('Test Point', 'identity', 'test-class');
        expect(added).to.be.true;
        const point = document.querySelector('#identity-section .bullet-points li');
        expect(point.textContent).to.equal('Test Point');
    });

    describe('Risk Score Calculations', () => {
        it('should detect multiple risk factors', async () => {
            const result = await app.analyzeComment({
                value: "I'll file a chargeback and I need this rushed immediately"
            });
            expect(result.riskScore).to.be.at.least(85);
        });

        it('should handle empty comments', async () => {
            const result = await app.analyzeComment({ value: "" });
            expect(result.riskScore).to.equal(0);
        });

        it('should be case insensitive', async () => {
            const result = await app.analyzeComment({
                value: "I WILL FILE A CHARGEBACK"
            });
            expect(result.riskScore).to.equal(85);
        });
    });

    describe('UI Updates', () => {
        it('should show deny button for high risk', () => {
            app.updateRiskScore(85);
            const denyButton = document.getElementById('denyButton');
            expect(denyButton.style.display).to.equal('block');
        });

        it('should hide deny button for low risk', () => {
            app.updateRiskScore(50);
            const denyButton = document.getElementById('denyButton');
            expect(denyButton.style.display).to.equal('none');
        });

        it('should add multiple bullet points', () => {
            app.addBulletPoint('Point 1', 'identity', 'high-risk');
            app.addBulletPoint('Point 2', 'identity', 'medium-risk');
            const points = document.querySelectorAll('#identity-section .bullet-points li');
            expect(points.length).to.equal(2);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid section names', () => {
            const result = app.addBulletPoint('Test', 'invalid-section');
            expect(result).to.be.false;
        });

        it('should handle null comment values', async () => {
            const result = await app.analyzeComment({ value: null });
            expect(result.riskScore).to.equal(0);
        });

        it('should handle undefined comment values', async () => {
            const result = await app.analyzeComment({});
            expect(result.riskScore).to.equal(0);
        });
    });
});

// Add new Performance Tests here
describe('Performance Tests', () => {
    it('should handle large comments quickly', async () => {
        const start = Date.now();
        await app.analyzeComment({
            value: "A very long comment...".repeat(100)
        });
        const duration = Date.now() - start;
        expect(duration).to.be.below(100); // Should complete in under 100ms
    });
});

// Add new Zendesk Integration Tests here
describe('Zendesk Integration', () => {
    it('should fetch ticket details', async () => {
        const result = await app.init();
        expect(result).to.have.property('client');
        expect(result).to.have.property('ticket');
        expect(result.ticket.ticket).to.have.property('id', '123');
    });
});

// Add API Integration Tests
describe('API Integration', () => {
    it('should initialize ZAF client', async () => {
        const result = await app.init();
        expect(result).to.have.property('client');
        expect(result).to.have.property('ticket');
    });
});

// Add after your existing test blocks
describe('Advanced API Integration', () => {
    let originalZAFClient;
    
    beforeEach(() => {
        originalZAFClient = global.ZAFClient;
    });
    
    afterEach(() => {
        global.ZAFClient = originalZAFClient;
    });

    it('should handle API errors gracefully', async () => {
        global.ZAFClient = {
            init: () => ({
                context: async () => { throw new Error('API Error'); },
                get: async () => { throw new Error('API Error'); }
            })
        };
        
        const result = await app.init();
        expect(result).to.be.null;
    });

    it('should process ticket updates', async () => {
        // Create a promise to track if the callback was registered
        let registeredCallback = null;
        
        global.ZAFClient = {
            init: () => ({
                context: async () => ({ location: 'ticket_sidebar' }),
                get: async () => ({ ticket: { id: '123' } }),
                on: (event, callback) => {
                    if (event === 'ticket.updated') {
                        registeredCallback = callback;
                    }
                },
                off: () => {}
            })
        };

        const client = await app.init();
        
        // Verify the callback was registered
        expect(registeredCallback).to.be.a('function');
        
        // Test the callback
        if (registeredCallback) {
            const updateData = { ticket: { id: '123', status: 'updated' } };
            await registeredCallback(updateData);
        }
    });
});

describe('Performance Benchmarks', () => {
    it('should process multiple comments efficiently', async () => {
        const start = Date.now();
        const comments = Array(100).fill().map(() => ({
            value: "Test comment with potential chargeback mention"
        }));
        
        for (const comment of comments) {
            await app.analyzeComment(comment);
        }
        
        const duration = Date.now() - start;
        expect(duration).to.be.below(1000); // Should process 100 comments in under 1 second
    });

    it('should handle concurrent operations', async () => {
        const operations = Array(10).fill().map(() => app.analyzeComment({
            value: "Concurrent test comment"
        }));
        
        const results = await Promise.all(operations);
        expect(results).to.have.lengthOf(10);
    });
});

describe('Resource Usage', () => {
    it('should maintain reasonable memory usage', async () => {
        const initialMemory = process.memoryUsage().heapUsed;
        
        // Perform intensive operations
        await Promise.all(Array(1000).fill().map(() => 
            app.analyzeComment({ value: "Memory test comment" })
        ));
        
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
        
        expect(memoryIncrease).to.be.below(50); // Should use less than 50MB additional memory
    });
});

describe('Edge Cases', () => {
    it('should handle unicode characters', async () => {
        const result = await app.analyzeComment({
            value: "I'll file a 🏦 chargeback 💳"
        });
        expect(result.riskScore).to.equal(85);
    });

    it('should handle very long comments', async () => {
        const longComment = "x".repeat(10000) + "chargeback" + "x".repeat(10000);
        const result = await app.analyzeComment({ value: longComment });
        expect(result.riskScore).to.equal(85);
    });

    it('should handle special characters', async () => {
        const result = await app.analyzeComment({
            value: "C-h-a-r-g-e-b-a-c-k!"
        });
        expect(result.riskScore).to.equal(85);
    });
});