const { expect } = require('chai');
const { 
    monitorTicket, 
    handleTicketUpdate, 
    processTicketEvent 
} = require('../../api/ticketMonitor');

describe('Ticket Monitor', () => {
    it('should handle empty updates', async () => {
        const result = await handleTicketUpdate({});
        expect(result).to.deep.equal({ 
            riskScore: 0, 
            success: true 
        });
    });

    it('should process ticket updates', async () => {
        const result = await handleTicketUpdate({
            ticket: {
                id: '123',
                comment: { body: 'Test comment' }
            }
        });
        expect(result.success).to.be.true;
    });

    it('should handle monitoring errors', async () => {
        try {
            await monitorTicket(null);
        } catch (error) {
            expect(error.message).to.include('Invalid ticket data');
        }
    });

    it('should handle ticket events', async () => {
        const result = await processTicketEvent({
            type: 'Comment',
            ticket_id: '123',
            comment: { body: 'New comment' }
        });
        expect(result.processed).to.be.true;
    });
});