const { expect } = require('chai');

describe('Basic Test Setup', () => {
    it('should have working test environment', () => {
        expect(true).to.be.true;
    });

    it('should have access to DOM', () => {
        expect(document.getElementById('currentScore')).to.exist;
    });

    it('should have working localStorage mock', () => {
        localStorage.setItem('test', 'value');
        expect(localStorage.getItem('test')).to.equal('value');
        localStorage.removeItem('test');
        expect(localStorage.getItem('test')).to.be.null;
    });

    it('should have working ZAFClient mock', async () => {
        const client = ZAFClient.init();
        const context = await client.context();
        expect(context.location).to.equal('ticket_sidebar');
    });
});