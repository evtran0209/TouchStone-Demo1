const { expect } = require('chai');
const { handleTicketUpdate } = require('../../api/ticketMonitor');

describe('Performance Tests', () => {
    it('should handle large batches of updates', async () => {
        const updates = Array(100).fill().map((_, i) => ({
            ticket: {
                id: `TICKET-${i}`,
                comment: { body: 'Test comment' }
            }
        }));

        const results = await Promise.all(
            updates.map(update => handleTicketUpdate(update))
        );

        expect(results).to.have.length(100);
        results.forEach(result => {
            expect(result.success).to.be.true;
        });
    });

    it('should maintain performance with concurrent operations', async () => {
        const start = Date.now();
        
        const updates = Array(10).fill().map((_, i) => ({
            ticket: {
                id: `TICKET-${i}`,
                comment: { body: 'Test comment with chargeback' }
            }
        }));

        await Promise.all(
            updates.map(update => handleTicketUpdate(update))
        );

        const duration = Date.now() - start;
        expect(duration).to.be.below(1000); // Should complete within 1 second
    });
});