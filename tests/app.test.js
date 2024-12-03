const { expect } = require('chai');
const app = require('../scripts/app');

describe('App Core Functions', () => {
    beforeEach(() => {
        // Create required DOM elements if they don't exist
        if (!document.getElementById('currentScore')) {
            const scoreDiv = document.createElement('div');
            scoreDiv.id = 'currentScore';
            document.body.appendChild(scoreDiv);
        }

        if (!document.getElementById('denyButton')) {
            const button = document.createElement('button');
            button.id = 'denyButton';
            document.body.appendChild(button);
        }

        // Reset DOM elements
        document.getElementById('currentScore').textContent = '0';
        document.getElementById('denyButton').style.display = 'none';
    });

    it('should initialize correctly', async () => {
        const result = await app.init();
        expect(result).to.exist;
    });
});