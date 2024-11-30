const config = process.env.NODE_ENV === 'test' 
    ? require('../config/test.config')
    : require('../config/config');

// Handles all ticket-related API endpoints
const ZendeskAPI = {
    baseUrl: config.zendesk.api.baseUrl,
    
    // Get ticket comments
    async getTicketComments(ticketId) {
        try {
            const response = await fetch(
                `${this.baseUrl}/tickets/${ticketId}/comments.json`,
                {
                    headers: {
                        'Authorization': `Basic ${config.zendesk.credentials.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching ticket comments:', error);
            throw error;
        }
    },

    // Monitor risk levels
    async monitorRiskLevels(ticketId) {
        try {
            const comments = await this.getTicketComments(ticketId);
            const riskAnalysis = await this.analyzeRisk(comments);
            return {
                ticketId,
                riskScore: riskAnalysis.score,
                triggers: riskAnalysis.triggers,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Error monitoring risk levels:', error);
            throw error;
        }
    },

    // Analyze risk from comments
    async analyzeRisk(comments) {
        let riskScore = 0;
        const triggeredPhrases = [];

        comments.forEach(comment => {
            const text = comment.body.toLowerCase();
            
            // Check against your existing triggers
            Object.entries(config.app.triggers).forEach(([category, triggerList]) => {
                triggerList.forEach(trigger => {
                    if (text.includes(trigger.phrase)) {
                        riskScore = Math.max(riskScore, trigger.score);
                        triggeredPhrases.push({
                            category,
                            phrase: trigger.phrase,
                            score: trigger.score
                        });
                    }
                });
            });
        });

        return {
            score: riskScore,
            triggers: triggeredPhrases
        };
    },

    // Update dashboard stats
    async updateDashboardStats() {
        try {
            const stats = {
                totalTicketsMonitored: 0,
                highRiskTickets: 0,
                mediumRiskTickets: 0,
                lowRiskTickets: 0,
                recentTriggers: []
            };

            // Get recent tickets
            const tickets = await this.getRecentTickets();
            
            // Analyze each ticket
            for (const ticket of tickets) {
                const riskAnalysis = await this.monitorRiskLevels(ticket.id);
                
                stats.totalTicketsMonitored++;
                
                if (riskAnalysis.riskScore >= config.app.riskThreshold) stats.highRiskTickets++;
                else if (riskAnalysis.riskScore >= 50) stats.mediumRiskTickets++;
                else stats.lowRiskTickets++;

                if (riskAnalysis.triggers.length > 0) {
                    stats.recentTriggers.push({
                        ticketId: ticket.id,
                        triggers: riskAnalysis.triggers,
                        timestamp: new Date()
                    });
                }
            }

            return stats;
        } catch (error) {
            console.error('Error updating dashboard stats:', error);
            throw error;
        }
    }
};

module.exports = ZendeskAPI;