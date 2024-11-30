const express = require('express');
const router = express.Router();
const { riskAssessmentAPI, monitoringAPI } = require('./endpoints');

// Risk Assessment Routes
router.get('/risk-analysis/:ticketId', riskAssessmentAPI.analyzeRisk);
router.get('/threats-alert/:ticketId', riskAssessmentAPI.threatsAlert);
router.get('/dashboard-stats', riskAssessmentAPI.getDashboardStats);

// Monitoring Routes
router.get('/comments/:ticketId', monitoringAPI.getRecentComments);
router.get('/risk-levels/:ticketId', monitoringAPI.monitorRiskLevels);

module.exports = router;