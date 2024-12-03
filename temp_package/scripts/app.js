(function() {
    'use strict';

    let client = null;
    let isInitialized = false;
    let isDebugMode = true;

    function debugLog(message, data = null) {
        console.log(`[Risk Widget Debug] ${message}`, data || '');
    }

    const triggers = {
        identity: [
            { phrase: "chargeback", text: "Chargeback Threat Detected", score: 85 },
            { phrase: "fair credit billing act", text: "FCBA Reference Detected", score: 85 }
        ],
        conversation: [
            { phrase: "chargeback", text: "Chargeback Language Used", score: 68 },
            { phrase: "refund", text: "Refund Request", score: 50 },
            { phrase: "dispute", text: "Payment Dispute Mentioned", score: 60 }
        ],
        delivery: [
            { phrase: "nothing came", text: "Delivery Dispute", score: 36 },
            { phrase: "never received", text: "Non-Receipt Claim", score: 45 },
            { phrase: "impossible", text: "Delivery Challenge", score: 54 }
        ]
    };

    async function initializeWidget() {
        debugLog('Starting widget initialization');
        
        try {
            client = await ZAFClient.init();
            debugLog('ZAF Client initialized');

            // Set up resize handler
            await client.invoke('resize', { width: '100%', height: '400px' });
            debugLog('Widget resized');

            // Get initial ticket data
            const ticketData = await client.get('ticket');
            debugLog('Initial ticket data received:', ticketData);

            // Set up event listeners
            client.on('ticket.conversation.changed', async () => {
                debugLog('Conversation changed event triggered');
                await updateTicketAnalysis();
            });

            client.on('ticket.comments.changed', async () => {
                debugLog('Comments changed event triggered');
                await updateTicketAnalysis();
            });

            // Initial analysis
            await updateTicketAnalysis();
            
            isInitialized = true;
            debugLog('Widget fully initialized');
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }

    async function updateTicketAnalysis() {
        try {
            debugLog('Starting ticket analysis');
            
            // Get current ticket data
            const ticketData = await client.get(['ticket.conversation', 'ticket.comments']);
            debugLog('Retrieved ticket data:', ticketData);

            const analysis = {
                identity: [],
                conversation: [],
                delivery: [],
                totalScore: 0
            };

            // Analyze conversation messages
            if (ticketData['ticket.conversation']) {
                const messages = ticketData['ticket.conversation'].messages || [];
                debugLog('Analyzing conversation messages:', messages.length);
                messages.forEach(message => {
                    const messageText = message.content || '';
                    const messageAnalysis = analyzeText(messageText);
                    mergeAnalysis(analysis, messageAnalysis);
                });
            }

            // Analyze comments
            if (ticketData['ticket.comments']) {
                const comments = ticketData['ticket.comments'] || [];
                debugLog('Analyzing comments:', comments.length);
                comments.forEach(comment => {
                    const commentText = comment.text || '';
                    const commentAnalysis = analyzeText(commentText);
                    mergeAnalysis(analysis, commentAnalysis);
                });
            }

            debugLog('Analysis results:', analysis);
            await updateUI(analysis);
        } catch (error) {
            console.error('Failed to update analysis:', error);
        }
    }

    function analyzeText(text) {
        debugLog('Analyzing text:', text);
        const results = {
            identity: [],
            conversation: [],
            delivery: [],
            totalScore: 0
        };

        Object.entries(triggers).forEach(([category, categoryTriggers]) => {
            categoryTriggers.forEach(trigger => {
                if (text.toLowerCase().includes(trigger.phrase.toLowerCase())) {
                    debugLog(`Trigger matched: ${trigger.phrase}`);
                    results[category].push({
                        message: trigger.text,
                        level: trigger.score >= 85 ? 'high' : trigger.score >= 50 ? 'medium' : 'low',
                        score: trigger.score
                    });
                    results.totalScore = Math.max(results.totalScore, trigger.score);
                }
            });
        });

        debugLog('Analysis results:', results);
        return results;
    }

    function mergeAnalysis(target, source) {
        target.totalScore = Math.max(target.totalScore, source.totalScore);
        target.identity = [...target.identity, ...source.identity];
        target.conversation = [...target.conversation, ...source.conversation];
        target.delivery = [...target.delivery, ...source.delivery];
    }

    async function updateUI(analysis) {
        debugLog('Updating UI with analysis:', analysis);
        
        updateRiskMeter(analysis.totalScore);
        updateSection('identitySection', analysis.identity);
        updateSection('conversationSection', analysis.conversation);
        updateSection('deliverySection', analysis.delivery);
    }

    function updateRiskMeter(score) {
        debugLog('Updating risk meter:', score);
        const scoreElement = document.getElementById('currentScore');
        const riskLevel = document.getElementById('riskLevel');
        const meterContainer = document.getElementById('riskMeterContainer');
        
        if (!scoreElement || !riskLevel || !meterContainer) {
            console.error('Required DOM elements not found');
            return;
        }

        scoreElement.textContent = `${score}%`;
        
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
        
        meterContainer.style.background = `conic-gradient(${color} ${score}%, #e0e0e0 ${score}%)`;
        riskLevel.textContent = levelText;
        riskLevel.style.color = color;
    }

    function updateSection(sectionId, risks) {
        debugLog(`Updating section ${sectionId}:`, risks);
        const section = document.getElementById(sectionId);
        if (!section) {
            console.error(`Section ${sectionId} not found`);
            return;
        }

        if (risks.length === 0) {
            section.innerHTML = '<li class="no-triggers">No risks detected</li>';
        } else {
            section.innerHTML = risks
                .map(risk => `<li class="risk-${risk.level}">${risk.message}</li>`)
                .join('');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
    } else {
        initializeWidget();
    }
})();