const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { app } = require('../../server');
let server;

chai.use(chaiHttp);

describe('API Integration Tests', () => {
    before(function(done) {
        server = app.listen(0, () => {
            this.address = server.address();
            done();
        });
    });

    after(function(done) {
        if (server) server.close(done);
    });

    it('should analyze comment risk', async () => {
        const response = await chai.request(app)
            .post('/api/analyze')
            .send({
                comment: 'Customer mentioned chargeback'
            });
        
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('riskScore');
    });
});