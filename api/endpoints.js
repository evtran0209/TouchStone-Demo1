const config = require('../config/config');
const ZendeskAPI = require('./ticketMonitor');

// Collection 1: TouchStone Risk Assessment API
const riskAssessmentAPI = {
    // Risk Analysis endpoint
    async analyzeRisk(req, res) {
        try {
            const { ticketId } = req.params;
            const riskAnalysis = await ZendeskAPI.monitorRiskLevels(ticketId);
            res.json({
                success: true,
                data: riskAnalysis
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Threats Alert endpoint
    async threatsAlert(req, res) {
        try {
            const { ticketId } = req.params;
            const alerts = await ZendeskAPI.checkThreats(ticketId);
            res.json({
                success: true,
                data: alerts
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Dashboard Stats endpoint
    async getDashboardStats(req, res) {
        try {
            const stats = await ZendeskAPI.updateDashboardStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

// Collection 2: Monitoring endpoints
const monitoringAPI = {
    // Get Recent Comments
    async getRecentComments(req, res) {
        try {
            const { ticketId } = req.params;
            const comments = await ZendeskAPI.getTicketComments(ticketId);
            res.json({
                success: true,
                data: comments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Monitor Risk Levels
    async monitorRiskLevels(req, res) {
        try {
            const { ticketId } = req.params;
            const riskLevels = await ZendeskAPI.monitorRiskLevels(ticketId);
            res.json({
                success: true,
                data: riskLevels
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = {
    riskAssessmentAPI,
    monitoringAPI
};