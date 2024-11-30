(function() {
  'use strict';

  const config = require('../config/config');
  const ZendeskAPI = require('../api/ticketMonitor');

  const isBrowser = typeof window !== 'undefined';
  const client = isBrowser ? ZAFClient.init() : null;

  let currentTicketId = null;

  // API Configuration
  const API_CONFIG = {
    subdomain: window.location.hostname.split('.')[0],
    version: 'v2',
    baseUrl: `https://${window.location.hostname}/api/v2/`
  };

  // State management
  const state = {
    currentScore: 0,
    scoreThresholds: [23, 36, 54, 68, 85],
    currentThresholdIndex: 0,
    addedBulletPoints: new Set(),
    riskThreshold: 85,
    initialIdentityChecksAdded: false,
    lastProcessedMessage: null,
    processedComments: new Set()
  };

  // Test conversation simulation
  const testConversation = [
    { text: "I don't have it handy", delay: 2000 },
    { text: "I'm in a rush", delay: 4000 },
    { text: "That's impossible", delay: 6000 },
    { text: "I'll file a chargeback", delay: 8000 },
    { text: "fair credit billing act", delay: 10000 }
  ];

  // Risk assessment triggers
  const triggers = {
    identity: [
      { phrase: "don't have it handy", text: "Unable to Provide Order Information", color: "text-yellow-500", score: 23 },
      { phrase: "can't you find it", text: "Avoidance of Order Verification Process Detected: Medium", color: "text-yellow-500", score: 36 }
    ],
    conversation: [
      { phrase: "rush", text: "Urgency Detected: High", color: "text-red-500", score: 36, additionalPoints: [
          { text: "Story Fabrication: Similar to Past Fraudulent Scripts", color: "text-red-500" }
        ]
      },
      { phrase: "chargeback", text: "Threatening Language: High (Related to Chargebacks)", color: "text-red-500", score: 68, additionalPoints: [
          { text: "Excessive Knowledge of Chargeback Knowledge consistent with Past Fraudulent Claims", color: "text-red-500" }
        ]
      },
      { phrase: "fair credit billing act", text: "Excessive Knowledge of Chargebacks", color: "text-red-500", score: 85 }
    ],
    delivery: [
      { phrase: "impossible", text: "Package was delivered. Proven by Photo Proof of Delivery", color: "text-yellow-500", score: 54 },
      { phrase: "nothing came", text: "Did Not Arrive Claims Not Supported by Tracking Evidence", color: "text-red-500", score: 36 }
    ]
  };

  // Define all functions before using them
  function updateRiskScore(score) {
    try {
        const scoreElement = document.getElementById('currentScore');
        const denyButton = document.getElementById('denyButton');
        
        if (scoreElement) {
            scoreElement.textContent = `${score}%`;
        }
        
        if (denyButton) {
            denyButton.style.display = score >= 85 ? 'block' : 'none';
        }
        
        return score;
    } catch (error) {
        console.error('Error updating risk score:', error);
        return 0;
    }
  }

  function addBulletPoint(message, section, className = '') {
    try {
        const sectionElement = document.querySelector(`#${section}-section .bullet-points`);
        if (!sectionElement) return false;

        const li = document.createElement('li');
        li.textContent = message;
        li.className = `bullet-point ${className}`;
        sectionElement.appendChild(li);
        return true;
    } catch (error) {
        console.error('Error adding bullet point:', error);
        return false;
    }
  }

  async function analyzeComment(comment) {
    try {
        if (!comment || comment.value == null) {
            return { riskScore: 0 };
        }

        // Normalize the text: remove special characters and convert to lowercase
        const text = comment.value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '');

        let riskScore = 0;

        if (text.includes('chargeback')) {
            riskScore = Math.max(riskScore, 85);
            addBulletPoint('Chargeback Threat Detected', 'conversation', 'high-risk');
        }

        updateRiskScore(riskScore);
        return { riskScore };
    } catch (error) {
        console.error('Error analyzing comment:', error);
        return { riskScore: 0 };
    }
  }

  async function init() {
    try {
        const client = ZAFClient.init();
        console.log('ZAF Client initialized');
        
        const context = await client.context();
        const ticket = await client.get('ticket');
        console.log('Current ticket ID:', ticket.ticket.id);
        
        // Set up ticket update listener
        client.on('ticket.updated', async (updateData) => {
            console.log('Ticket updated:', updateData);
            await handleTicketUpdate(updateData);
        });
        
        return { client, ticket };
    } catch (error) {
        console.error('Initialization failed:', error);
        return null;
    }
  }

  async function handleTicketUpdate(updateData) {
    try {
        if (updateData && updateData.ticket) {
            // Process the ticket update
            const ticketId = updateData.ticket.id;
            const status = updateData.ticket.status;
            console.log(`Processing update for ticket ${ticketId}, new status: ${status}`);
            
            // Add any specific update handling logic here
            if (status === 'updated') {
                await analyzeComment({ value: 'Ticket status updated' });
            }
        }
    } catch (error) {
        console.error('Error handling ticket update:', error);
    }
  }

  async function testWidget() {
    try {
        await init();
        console.log('Widget initialized successfully');
        
        const testComment = {
            value: "I'll file a chargeback if this isn't resolved immediately"
        };
        console.log('Analyzing comment:', testComment);
        
        await analyzeComment(testComment);
        console.log('Widget test completed successfully');
    } catch (error) {
        console.error('Widget test failed:', error);
    }
  }

  // Export all functions
  const appExports = {
    init,
    updateRiskScore,
    addBulletPoint,
    analyzeComment,
    testWidget,
    handleTicketUpdate
  };

  // Handle both browser and Node.js environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = appExports;
  } else if (typeof window !== 'undefined') {
    window.app = appExports;
  }

  // Initialize if in browser environment
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', init);
  }

})();