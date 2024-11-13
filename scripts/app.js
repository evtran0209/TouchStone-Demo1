(function() {
    'use strict';
  
    // Initialize the Zendesk Client
    const client = ZAFClient.init();
    
    // State management
    const state = {
      currentScore: 0,
      scoreThresholds: [23, 36, 54, 68, 85],
      currentThresholdIndex: 0,
      addedBulletPoints: new Set(),
      riskThreshold: 85 // Default threshold
    };
  
    // Conversation triggers configuration
    const conversationTriggers = {
      identityTriggers: {
        "don't have it handy": [
          {
            section: 'identity',
            text: 'Unable to Provide Order Information',
            color: 'text-yellow-500'
          }
        ],
        "can't you find it": [
          {
            section: 'identity',
            text: 'Avoiding Order Verification',
            color: 'text-red-500'
          }
        ]
      },
      behaviorTriggers: {
        "rush": [
          {
            section: 'conversation',
            text: 'Urgency Detected: High',
            color: 'text-red-500'
          }
        ],
        "chargeback": [
          {
            section: 'conversation',
            text: 'Threatening Language Detected: High',
            color: 'text-red-500'
          },
          {
            section: 'conversation',
            text: 'Excessive Knowledge of Chargeback Knowledge',
            color: 'text-yellow-500'
          }
        ]
      },
      deliveryTriggers: {
        "impossible": [
          {
            section: 'delivery',
            text: 'Package was delivered. Proven by Photo Proof of Delivery',
            color: 'text-yellow-500'
          }
        ],
        "nothing came": [
          {
            section: 'delivery',
            text: 'Did Not Arrive Claims Not Supported by Tracking Evidence',
            color: 'text-red-500'
          }
        ]
      }
    };
  
    // Main functionality
    class FraudDetectionWidget {
      constructor() {
        this.initializeEventListeners();
        this.updateRiskMeter(0);
      }
  
      async initializeEventListeners() {
        // Listen for new messages
        client.on('ticket.conversation.changed', async () => {
          const data = await client.get('ticket.conversation.comment');
          const latestComment = data['ticket.conversation.comment'];
          
          if (latestComment && latestComment.text) {
            this.handleNewMessage(latestComment.text);
          }
        });
  
        // Handle deny button click
        document.getElementById('denyButton').addEventListener('click', () => this.handleDenyClick());
      }
  
      updateRiskMeter(score) {
        const circumference = 2 * Math.PI * 90;
        const strokeDasharray = (score / 100) * circumference;
        const meterValue = document.querySelector('.meter-value');
        const scoreText = document.querySelector('.score-text tspan:first-child');
        
        meterValue.style.strokeDasharray = `${strokeDasharray} ${circumference}`;
        meterValue.style.strokeDashoffset = circumference;
        scoreText.textContent = `${score}%`;
        
        if (score >= state.riskThreshold) {
          document.getElementById('denyButton').classList.remove('hidden');
        }
      }
  
      async addBulletPoint(section, text, color) {
        const bulletPointId = `${section}-${text}`;
        
        if (state.addedBulletPoints.has(bulletPointId)) {
          return;
        }
        
        const ul = document.querySelector(`#${section}-section ul`);
        const li = document.createElement('li');
        li.className = `bullet-point flex items-center space-x-2 ${color}`;
        
        // Add loading animation
        const loading = document.createElement('div');
        loading.className = 'loading-dot';
        loading.innerHTML = '•';
        li.appendChild(loading);
        
        const span = document.createElement('span');
        span.textContent = text;
        li.appendChild(span);
        
        ul.appendChild(li);
        
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        loading.remove();
        li.classList.add('show');
        
        state.addedBulletPoints.add(bulletPointId);
      }
  
      checkTriggers(message) {
        const lowerMessage = message.toLowerCase();
        
        Object.entries(conversationTriggers).forEach(([_, categoryTriggers]) => {
          Object.entries(categoryTriggers).forEach(([trigger, actions]) => {
            if (lowerMessage.includes(trigger)) {
              actions.forEach(action => {
                this.addBulletPoint(action.section, action.text, action.color);
              });
            }
          });
        });
      }
  
      handleNewMessage(message) {
        this.checkTriggers(message);
        
        if (state.currentThresholdIndex < state.scoreThresholds.length) {
          state.currentScore = state.scoreThresholds[state.currentThresholdIndex];
          this.updateRiskMeter(state.currentScore);
          state.currentThresholdIndex++;
        }
      }
  
      async handleDenyClick() {
        try {
          await client.invoke('ticket.comment.appendText', {
            text: 'The Customer Support Representative has ended the chat due to detection of fraudulent behavior in this conversation.'
          });
          
          await client.invoke('ticket.update', {
            status: 'closed'
          });
        } catch (error) {
          console.error('Error handling deny click:', error);
        }
      }
    }
  
    // Initialize the widget
    const widget = new FraudDetectionWidget();
  })();