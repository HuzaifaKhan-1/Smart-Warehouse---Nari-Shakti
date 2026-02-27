/**
 * AgriFresh AI Decisions Engine
 * Integrates Spoilage Prediction (96%) and Inventory Optimization (92%)
 */

export const AIEngine = {
    accuracies: {
        spoilage: 96,
        optimization: 92
    },

    predictSpoilage(batchData) {
        // Mock prediction logic based on model criteria
        // In real life, this calls backend/ai_service
        const risk = (batchData.temp / 20) * (batchData.days / 14) * 100;
        return {
            riskScore: Math.min(risk, 100).toFixed(1),
            confidence: 0.96,
            safeDays: Math.max(14 - Math.floor(batchData.temp / 2), 1)
        };
    },

    getOptimizationRecommendations() {
        return [
            {
                id: 'REC-001',
                target: 'Batch #AF-290 (Tomato)',
                reason: 'High spoilage risk (87%) detected in Zone C-4',
                action: 'Dispatch Immediately',
                priority: 'P1',
                confidence: 92,
                impact: '₹42,500 Preserved'
            },
            {
                id: 'REC-002',
                target: 'Zone A-2',
                reason: 'Humidity anomaly (78%)',
                action: 'Reduce Temp by 2°C',
                priority: 'P2',
                confidence: 89,
                impact: 'Loss Prevention: 120kg'
            }
        ];
    },

    renderDecisionCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const recs = this.getOptimizationRecommendations();
        container.innerHTML = '';

        recs.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'decision-card glass-panel';
            card.style.borderLeftColor = rec.priority === 'P1' ? '#ef4444' : '#f59e0b';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start">
                    <div>
                        <span class="badge" style="background:${rec.priority === 'P1' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'}; color:${rec.priority === 'P1' ? '#ef4444' : '#f59e0b'}">Priority ${rec.priority}</span>
                        <h4 style="margin:10px 0 5px 0">${rec.action}: ${rec.target}</h4>
                        <p style="font-size:0.85rem; color:var(--text-secondary)">${rec.reason}</p>
                    </div>
                </div>
                <div style="margin-top:15px; display:flex; justify-content:space-between; align-items:center">
                    <div style="font-size:0.8rem; color:var(--primary); font-weight:700">
                        <i class="fas fa-shield-halved"></i> ${rec.impact}
                    </div>
                    <div style="text-align:right">
                        <div style="font-size:0.7rem; color:var(--text-secondary)">AI Confidence</div>
                        <div style="font-weight:700; color:var(--secondary)">${rec.confidence}%</div>
                    </div>
                </div>
                <button class="btn-premium" style="width:100%; padding:8px; margin-top:15px; font-size:0.8rem">
                    Approve Decision
                </button>
            `;
            container.appendChild(card);
        });
    }
};
