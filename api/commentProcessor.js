function processComments(comments) {
    try {
        if (!Array.isArray(comments)) {
            return [];
        }

        return comments.map(comment => {
            if (!comment || typeof comment.body !== 'string') {
                return { riskScore: 0 };
            }

            const text = comment.body.toLowerCase();
            let riskScore = 25; // Default risk score for any comment

            // Risk triggers
            if (text.includes('chargeback')) {
                riskScore = 85;
            } else if (text.includes('refund')) {
                riskScore = 50;
            }

            return {
                text: comment.body,
                riskScore,
                processed: true
            };
        });
    } catch (error) {
        console.error('Error processing comments:', error);
        return [];
    }
}

module.exports = { processComments };