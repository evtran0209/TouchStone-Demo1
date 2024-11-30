const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Create a mock DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <body>
    <div id="riskMeter">
      <span class="score-value">0%</span>
      <div id="currentScore">0</div>
    </div>
    <div id="sections">
      <div id="identity-section">
        <h3>Identity Verification</h3>
        <ul class="bullet-points"></ul>
      </div>
      <div id="conversation-section">
        <h3>Conversation Analysis</h3>
        <ul class="bullet-points"></ul>
      </div>
      <div id="delivery-section">
        <h3>Delivery Assessment</h3>
        <ul class="bullet-points"></ul>
      </div>
    </div>
    <button id="denyButton" style="display: none;">Deny</button>
  </body>
</html>
`);

// Set up global DOM environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Updated ZAFClient mock with all required methods
const createZAFClient = (options = {}) => ({
    context: async () => ({ location: 'ticket_sidebar', ticketId: '123' }),
    get: async (path) => {
        if (path === 'ticket') {
            return { ticket: { id: '123', status: 'open' } };
        }
        return null;
    },
    invoke: async () => ({}),
    on: (event, callback) => {
        if (event === 'ticket.updated') {
            // Store the callback for testing
            createZAFClient.lastCallback = callback;
        }
    },
    off: () => {},
    ...options
});

// Add this to access the last registered callback
createZAFClient.lastCallback = null;

// Export the mock creator
global.ZAFClient = {
    init: () => createZAFClient()
};

// Mock fetch
global.fetch = require('node-fetch');