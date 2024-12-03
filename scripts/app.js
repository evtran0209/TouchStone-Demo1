(function() {
    'use strict';

    let client = null;
    const API_URL = 'https://0004-168-92-227-70.ngrok-free.app';

    async function initializeWidget() {
        try {
            client = await ZAFClient.init();
            console.log('Widget initialized');
            
            // Set up ticket update listener
            client.on('ticket.conversation.changed', handleTicketUpdate);
            client.on('ticket.save', async function() {
                console.log('Ticket saved event triggered');
                const ticket = await client.get('ticket');
                console.log('Current ticket:', ticket);
            });
            
            // Initial analysis
            const ticket = await client.get('ticket');
            if (ticket && ticket.ticket) {
                await analyzeTicket(ticket.ticket);
            }
        } catch (error) {
            console.error('Failed to initialize widget:', error);
        }
    }

    async function handleTicketUpdate() {
        const ticket = await client.get('ticket');
        if (ticket && ticket.ticket) {
            await analyzeTicket(ticket.ticket);
        }
    }

    async function analyzeTicket(ticket) {
        try {
            // Get the latest comment
            const comments = await client.get('ticket.comments');
            if (!comments || !comments.comments || !comments.comments.length) return;
            
            const latestComment = comments.comments[comments.comments.length - 1];
            
            // Analyze the comment
            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ comment: latestComment.body })
            });

            if (!response.ok) {
                console.error('Analysis failed:', response.status);
                return [];
            }
            
            const data = await response.json();
            console.log('Analysis response:', data);
            updateUI(data.risks);
        } catch (error) {
            console.error('Analysis error:', error);
        }
    }

    function updateUI(risks) {
        const section = document.getElementById('identitySection');
        const bulletList = section.querySelector('.bullet-points');
        
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
                li.className = `risk-${risk.level}`;
                bulletList.appendChild(li);
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
    } else {
        initializeWidget();
    }
})();