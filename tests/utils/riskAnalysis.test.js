const { expect } = require('chai');
const { analyzeRisk, analyzeComment } = require('../../utils/riskAnalysis');

describe('Risk Analysis', () => {
    it('should detect high-risk phrases', () => {
        // Test direct string input
        let result = analyzeRisk('Customer mentioned chargeback');
        expect(result).to.equal(85);

        // Test object input
        result = analyzeComment({ value: 'Customer mentioned chargeback' });
        expect(result).to.equal(85);
    });

    it('should detect medium-risk phrases', () => {
        // Test direct string input
        let result = analyzeRisk('Customer requested refund');
        expect(result).to.be.at.least(40);
        expect(result).to.equal(50);

        // Test object input
        result = analyzeComment({ value: 'Customer requested refund' });
        expect(result).to.be.at.least(40);
        expect(result).to.equal(50);
    });

    it('should handle empty input', () => {
        expect(analyzeRisk('')).to.equal(0);
        expect(analyzeComment({ value: '' })).to.equal(0);
        expect(analyzeComment(null)).to.equal(0);
        expect(analyzeComment(undefined)).to.equal(0);
    });

    it('should handle special characters', () => {
        const result = analyzeRisk('CHARGEBACK!!!');
        expect(result).to.equal(85);
    });

    it('should handle case insensitivity', () => {
        const result = analyzeRisk('cHaRgEbAcK');
        expect(result).to.equal(85);
    });

    it('should detect low-risk phrases', () => {
        const result = analyzeRisk('Where is my order status?');
        expect(result).to.equal(25);
    });

    it('should handle multiple risk levels in one comment', () => {
        const result = analyzeRisk('Where is my refund? I will file a chargeback!');
        expect(result).to.equal(85); // Should return highest risk level
    });

    it('should handle object input with missing value property', () => {
        const result = analyzeComment({});
        expect(result).to.equal(0);
    });

    it('should handle malformed input gracefully', () => {
        expect(analyzeRisk({})).to.equal(0);
        expect(analyzeRisk([])).to.equal(0);
        expect(analyzeRisk(123)).to.equal(0);
    });
});