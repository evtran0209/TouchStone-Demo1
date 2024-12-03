const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { app } = require('../server');

chai.use(chaiHttp);

describe('API Endpoints', () => {
    it('should process risk assessment', async () => {
        const response = await chai.request(app)
            .post('/api/analyze')
            .send({
                comment: 'Test comment mentioning chargeback'
            });
        
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('riskScore');
    });

    it('should handle ticket updates', async () => {
        const response = await chai.request(app)
            .post('/api/ticket/update')
            .send({
                ticketId: '123',
                comment: 'New comment about refund request'
            });
        
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('success', true);
    });
});

describe('Risk Analysis', () => {
    const { analyzeRisk } = require('../utils/riskAnalysis');

    it('should detect high-risk phrases', () => {
        const result = analyzeRisk('Customer mentioned chargeback');
        expect(result).to.equal(85);
    });

    it('should detect medium-risk phrases', () => {
        const result = analyzeRisk('Customer requested refund');
        expect(result).to.equal(50);
    });
});