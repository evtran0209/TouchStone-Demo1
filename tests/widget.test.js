const { expect } = require('chai');
const app = require('../scripts/app');

describe('Widget Functionality', () => {
    beforeEach(() => {
        // Reset DOM elements
        document.getElementById('currentScore').textContent = '0';
        document.getElementById('riskLevel').textContent = 'Low';
    });

    it('should initialize and process ticket data', async () => {
        // Mock ticket data with high-risk comment
        global.ZAFClient.init = () => ({
            context: () => Promise.resolve({ location: 'ticket_sidebar', ticketId: '123' }),
            get: () => Promise.resolve({
                ticket: {
                    id: '123',
                    comments: [{ body: 'Customer mentioned chargeback' }]
                }
            })
        });

        await app.init();
        expect(document.getElementById('currentScore').textContent).to.equal('85');
    });

    it('should update on new comments', async () => {
        await app.handleTicketUpdate({
            ticket: {
                id: '123',
                comment: { body: 'Customer mentioned chargeback' }
            }
        });
        expect(document.getElementById('riskLevel').textContent).to.equal('High');
    });
});