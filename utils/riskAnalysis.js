function analyzeRisk(comment) {
    try {
        if (!comment || typeof comment !== 'string') {
            return 0;
        }
        
        const text = comment.toLowerCase();

        // High risk phrases
        const highRiskPhrases = ['chargeback', 'fair credit billing act', 'attorney'];
        for (const phrase of highRiskPhrases) {
            if (text.includes(phrase)) {
                return 85;
            }
        }

        // Medium risk phrases
        const mediumRiskPhrases = ['refund', 'return', 'not received'];
        for (const phrase of mediumRiskPhrases) {
            if (text.includes(phrase)) {
                return 50;
            }
        }

        // Low risk phrases
        const lowRiskPhrases = ['where', 'status', 'tracking'];
        for (const phrase of lowRiskPhrases) {
            if (text.includes(phrase)) {
                return 25;
            }
        }

        return 0;
    } catch (error) {
        console.error('Error in risk analysis:', error);
        return 0;
    }
}

module.exports = {
    analyzeRisk,
    analyzeComment: (comment) => {
        if (typeof comment === 'string') {
            return analyzeRisk(comment);
        }
        return analyzeRisk(comment?.value || '');
    }
};