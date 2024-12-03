const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const chai = require('chai');

// Create DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <body>
    <div id="currentScore">0</div>
    <div id="riskLevel">Low</div>
    <div id="denyButton" style="display: none;"></div>
    <ul class="bullet-points"></ul>
  </body>
</html>
`);

// Create a working localStorage mock
const storageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = String(value); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; },
        length: () => Object.keys(store).length,
        key: (index) => Object.keys(store)[index]
    };
})();

// Mock ZAFClient
global.ZAFClient = {
    init: () => ({
        context: () => Promise.resolve({ 
            location: 'ticket_sidebar',
            ticketId: '123'
        }),
        get: () => Promise.resolve({
            ticket: {
                id: '123',
                comments: [{ body: 'Test comment' }]
            }
        }),
        invoke: () => Promise.resolve({}),
        on: () => {},
        off: () => {}
    })
};

// Set up globals
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = storageMock;

module.exports = {
    expect: chai.expect,
    dom,
    localStorage: storageMock
};