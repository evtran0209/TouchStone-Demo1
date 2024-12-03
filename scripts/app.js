(function() {
    'use strict';

    // Initialize variables at the top
    let client = null;
    let isInitialized = false;
    let isDebugMode = true; // Enable detailed logging
    
    // Debug logging function
    function debugLog(message, data = null) {
        if (isDebugMode) {
            if (data) {
                console.log(`[Risk Widget Debug] ${message}:`, data);
            } else {
                console.log(`[Risk Widget Debug] ${message}`);
            }
        }
    }

    const triggers = {
        identity: [
            { phrase: "chargeback", text: "Chargeback Threat Detected", score: 85 },
            { phrase: "fair credit billing act", text: "FCBA Reference Detected", score: 85 }
        ],
        conversation: [
            { phrase: "chargeback", text: "Chargeback Language Used", score: 68 }
        ],
        delivery: [
            { phrase: "nothing came", text: "Delivery Dispute", score: 36 },
            { phrase: "impossible", text: "Delivery Challenge", score: 54 }
        ]
    };

    async function initializeWidget() {
        debugLog('Starting widget initialization');
        if (isInitialized) {
            debugLog('Widget already initialized');
            return;
        }
        
        try {
            debugLog('Creating ZAF Client');
            client = await ZAFClient.init();
            
            // Verify client initialization
            if (!client) {
                throw new Error('ZAF Client failed to initialize');
            }
            
            debugLog('ZAF Client created successfully');
            isInitialized = true;
            
            // Set up CORS headers and resize
            debugLog('Setting up widget display');
            await client.invoke('resize', { width: '100%', height: '500px' });
            
            // Set up ticket update listener
            debugLog('Setting up ticket update listener');
            client.on('ticket.conversation.changed', async (data) => {
                debugLog('Ticket conversation changed event received', data);
                await handleTicketUpdate(data);
            });

            // Perform initial analysis
            debugLog('Performing initial ticket analysis');
            const ticket = await client.get('ticket');
            debugLog('Initial ticket data received', ticket);
            
            if (ticket && ticket.ticket) {
                await updateRiskAnalysis();
            } else {
                debugLog('No initial ticket data available');
            }
            
        } catch (error) {
            console.error('[Risk Widget Error] Initialization failed:', error);
            isInitialized = false;
        }
    }

    async function handleTicketUpdate(event) {
        debugLog('Handling ticket update', event);
        if (!isInitialized) {
            console.error('[Risk Widget Error] Cannot handle update - widget not initialized');
            return;
        }

        try {
            await updateRiskAnalysis();
        } catch (error) {
            console.error('[Risk Widget Error] Failed to handle ticket update:', error);
        }
    }

    async function updateRiskAnalysis() {
        debugLog('Starting risk analysis update');
        if (!isInitialized) {
            console.error('[Risk Widget Error] Cannot update analysis - widget not initialized');
            return;
        }

        try {
            const ticket = await client.get('ticket');
            debugLog('Retrieved ticket data for analysis', ticket);

            if (!ticket || !ticket.ticket) {
                throw new Error('No ticket data available');
            }

            const comments = ticket.ticket.comments || [];
            const latestComment = comments[comments.length - 1];
            
            if (latestComment) {
                debugLog('Analyzing latest comment', latestComment);
                const analysis = analyzeComment(latestComment.text);
                debugLog('Analysis results', analysis);
                await updateUI(analysis);
            } else {
                debugLog('No comments found in ticket');
            }
        } catch (error) {
            console.error('[Risk Widget Error] Risk analysis failed:', error);
        }
    }

    function analyzeComment(comment) {
        debugLog('Starting comment analysis', comment);
        const text = comment.toLowerCase();
        const analysis = {
            riskScore: 0,
            identityRisks: [],
            behaviorRisks: [],
            deliveryRisks: []
        };

        // Check each trigger category
        Object.entries(triggers).forEach(([category, triggerList]) => {
            debugLog(`Checking ${category} triggers`);
            triggerList.forEach(trigger => {
                if (text.includes(trigger.phrase.toLowerCase())) {
                    debugLog(`Found matching trigger`, trigger);
                    const risk = {
                        message: trigger.text,
                        level: trigger.score >= 85 ? 'high' : trigger.score >= 50 ? 'medium' : 'low',
                        score: trigger.score
                    };

                    switch(category) {
                        case 'identity':
                            analysis.identityRisks.push(risk);
                            break;
                        case 'conversation':
                            analysis.behaviorRisks.push(risk);
                            break;
                        case 'delivery':
                            analysis.deliveryRisks.push(risk);
                            break;
                    }

                    analysis.riskScore = Math.max(analysis.riskScore, trigger.score);
                }
            });
        });

        debugLog('Analysis complete', analysis);
        return analysis;
    }

    async function updateUI(analysis) {
        debugLog('Updating UI with analysis results', analysis);
        try {
            // Update risk meter
            updateRiskMeter(analysis.riskScore);
            
            // Update risk sections
            updateBulletPoints('identitySection', analysis.identityRisks);
            updateBulletPoints('behaviorSection', analysis.behaviorRisks);
            updateBulletPoints('deliverySection', analysis.deliveryRisks);

            // Update deny button visibility
            const denyButton = document.getElementById('denyButton');
            if (denyButton) {
                const shouldShow = analysis.riskScore >= 85;
                debugLog(`Setting deny button visibility to ${shouldShow}`);
                denyButton.style.display = shouldShow ? 'block' : 'none';
            }

            debugLog('UI update complete');
        } catch (error) {
            console.error('[Risk Widget Error] UI update failed:', error);
        }
    }

    function updateRiskMeter(score) {
        debugLog('Updating risk meter with score', score);
        const meterContainer = document.getElementById('riskMeterContainer');
        const scoreElement = document.getElementById('currentScore');
        const riskLevel = document.getElementById('riskLevel');
        
        if (scoreElement) scoreElement.textContent = score;
        
        let color, levelText;
        if (score >= 85) {
            color = '#ff4444';
            levelText = 'High';
        } else if (score >= 50) {
            color = '#ffbb33';
            levelText = 'Medium';
        } else {
            color = '#00C851';
            levelText = 'Low';
        }
        
        if (meterContainer) {
            meterContainer.style.background = `conic-gradient(${color} ${score}%, #e0e0e0 ${score}%)`;
        }
        if (riskLevel) {
            riskLevel.textContent = levelText;
            riskLevel.style.color = color;
        }
        debugLog('Risk meter update complete');
    }

    function updateBulletPoints(sectionId, risks) {
        debugLog(`Updating bullet points for ${sectionId}`, risks);
        const section = document.getElementById(sectionId);
        if (!section) {
            debugLog(`Section ${sectionId} not found`);
            return;
        }

        const bulletList = section.querySelector('.bullet-points');
        if (!bulletList) {
            debugLog('Bullet list not found');
            return;
        }

        bulletList.innerHTML = '';

        if (risks.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No risks detected';
            li.className = 'no-triggers';
            bulletList.appendChild(li);
        } else {
            risks.forEach(risk => {
                const li = document.createElement('li');
                li.textContent = risk.message;
                li.className = `risk-${risk.level.toLowerCase()}`;
                bulletList.appendChild(li);
            });
        }
        debugLog(`Bullet points update complete for ${sectionId}`);
    }

    // Initialize when DOM is ready
    debugLog('Setting up DOM initialization');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
    } else {
        initializeWidget();
    }

    // Export test function
    window.testRiskAnalysis = async (phrase) => {
        debugLog('Running test analysis', phrase);
        if (!isInitialized) {
            console.error('[Risk Widget Error] Cannot test - widget not initialized');
            return null;
        }
        try {
            const analysis = analyzeComment(phrase);
            await updateUI(analysis);
            debugLog('Test analysis complete', analysis);
            return analysis;
        } catch (error) {
            console.error('[Risk Widget Error] Test failed:', error);
            return null;
        }
    };

    // Export debug toggle function
    window.toggleDebug = () => {
        isDebugMode = !isDebugMode;
        debugLog(`Debug mode ${isDebugMode ? 'enabled' : 'disabled'}`);
    };
})();