const { expect } = require('chai');
const { processComments } = require('../../api/commentProcessor');

describe('Comment Processor', () => {
    it('should process single comment', () => {
        const result = processComments([{ body: 'Test comment' }]);
        expect(result[0].riskScore).to.equal(25);
    });

    it('should process multiple comments', () => {
        const comments = [
            { body: 'Normal comment' },
            { body: 'Chargeback threat' },
            { body: 'Refund request' }
        ];
        const result = processComments(comments);
        expect(result).to.have.length(3);
        expect(result[1].riskScore).to.equal(85);
        expect(result[2].riskScore).to.equal(50);
    });

    it('should handle empty comments array', () => {
        const result = processComments([]);
        expect(result).to.be.an('array').that.is.empty;
    });
});