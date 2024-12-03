const { processComments } = require('./commentProcessor');

async function monitorTicket(ticketId) {
    try {
        if (!ticketId) {
            throw new Error('Invalid ticket data');
        }
        return {
            success: true,
            ticketId,
            status: 'monitoring'
        };
    } catch (error) {
        console.error('Error monitoring ticket:', error.message);
        throw error;
    }
}

async function handleTicketUpdate(data) {
    try {
        if (!data || !data.ticket) {
            return { 
                riskScore: 0, 
                success: true 
            };
        }

        const riskScore = await processComments([{
            body: data.ticket?.comment?.body || ''
        }]);

        return {
            success: true,
            riskScore: Array.isArray(riskScore) && riskScore[0] ? riskScore[0].riskScore : 0
        };
    } catch (error) {
        console.error('Error handling ticket update:', error);
        return { success: false, error: error.message };
    }
}

async function processTicketEvent(event) {
    try {
        if (!event || !event.type) {
            return { processed: false };
        }

        return {
            processed: true,
            type: event.type,
            ticketId: event.ticket_id
        };
    } catch (error) {
        console.error('Error processing ticket event:', error);
        return { processed: false, error: error.message };
    }
}

module.exports = {
    monitorTicket,
    handleTicketUpdate,
    processTicketEvent
};
