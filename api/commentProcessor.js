const processComments = async (comments) => {
    let riskScore = 0;
    const triggers = {
        highRisk: ['chargeback', 'fair credit billing act', 'attorney'],
        mediumRisk: ['refund', 'return', 'not received'],
        lowRisk: ['where', 'status', 'tracking']
    };

    comments.forEach(comment => {
        const text = comment.body.toLowerCase();
        
        triggers.highRisk.forEach(phrase => {
            if (text.includes(phrase)) riskScore = Math.max(riskScore, 85);
        });

        triggers.mediumRisk.forEach(phrase => {
            if (text.includes(phrase)) riskScore = Math.max(riskScore, 50);
        });

        triggers.lowRisk.forEach(phrase => {
            if (text.includes(phrase)) riskScore = Math.max(riskScore, 25);
        });
    });

    return riskScore;
};

module.exports = { processComments };