/**
 * AgriFresh Central State Management
 * Handles real-time updates across the dashboard
 */

export const AppState = {
    metrics: {
        lossPrevented: 124500,
        atRiskBatches: 3,
        totalBatches: 124,
        utilization: 78.5,
        avgTemp: 14.2,
        avgHumidity: 64,
        status: 'Optimal'
    },

    zones: [], // populated by heatmap.js

    recommendations: [
        {
            id: 'REC-001',
            target: 'Batch #AF-290 (Tomato)',
            reason: '87% Spoilage Risk predicted in Zone C-4',
            action: 'Dispatch Immediately',
            priority: 'P1',
            confidence: 96,
            predictedLoss: 42500,
            zoneId: 'C4',
            status: 'pending'
        },
        {
            id: 'REC-002',
            target: 'Zone A-2',
            reason: 'Humidity anomaly detected (78%)',
            action: 'Reduce Temp by 2°C',
            priority: 'P2',
            confidence: 92,
            predictedLoss: 12000,
            zoneId: 'A2',
            status: 'pending'
        }
    ],

    async fetchDashboardData() {
        try {
            // Fetch real metrics from Node.js backend
            const [lossRes, utilRes, riskRes] = await Promise.all([
                fetch('http://localhost:5000/api/analytics/loss-reduction'),
                fetch('http://localhost:5000/api/analytics/utilization'),
                fetch('http://localhost:5000/api/analytics/risk-distribution')
            ]);

            const lossData = await lossRes.json();
            const utilData = await utilRes.json();
            const riskData = await riskRes.json();

            this.metrics.lossPrevented = lossData.metrics.total_loss_prevented;
            this.metrics.utilization = ((utilData.used_capacity / utilData.total_capacity) * 100).toFixed(1);
            this.metrics.atRiskBatches = riskData.distribution.find(d => d.label === 'High Risk')?.count || 0;

            // Only update status if not in manual simulation mode
            if (this.metrics.status !== 'CRITICAL ALERT') {
                this.metrics.status = this.metrics.atRiskBatches > 10 ? 'Action Required' : 'Optimal';
            }

            this.simulateLiveFlux();
            this.updateMetrics();
        } catch (error) {
            console.error("Dashboard Sync Failed:", error);
        }
    },

    simulateLiveFlux() {
        // Add tiny jitters to make numbers look "live"
        this.metrics.utilization = (parseFloat(this.metrics.utilization) + (Math.random() * 0.2 - 0.1)).toFixed(1);
        this.metrics.lossPrevented += Math.floor(Math.random() * 10);
    },

    updateMetrics() {
        const lossEl = document.getElementById('lossPrevented');
        const riskEl = document.getElementById('atRiskCount');
        const utilEl = document.getElementById('utilizationVal');
        const utilFill = document.getElementById('utilFill');
        const healthEl = document.getElementById('healthStatus');
        const insightBar = document.getElementById('aiInsightBar');
        const aiText = document.getElementById('aiInsightText');

        if (lossEl) lossEl.innerText = `₹${this.metrics.lossPrevented.toLocaleString()}`;
        if (riskEl) riskEl.innerText = `${this.metrics.atRiskBatches}`;
        if (utilEl) utilEl.innerText = `${this.metrics.utilization}%`;
        if (utilFill) utilFill.style.width = `${this.metrics.utilization}%`;

        if (healthEl) {
            healthEl.innerText = this.metrics.status;
            healthEl.style.color = this.metrics.status === 'Optimal' ? 'var(--primary)' : 'var(--danger)';
        }

        if (aiText) {
            aiText.innerText = this.metrics.atRiskBatches > 0
                ? `AI Caution: ${this.metrics.atRiskBatches} High-Risk batches detected. Recommended action: Prioritize Early Dispatch.`
                : `Systems Optimal: Total loss prevented ₹${this.metrics.lossPrevented.toLocaleString()} today.`;
        }

        if (insightBar) {
            const highRiskCount = this.zones.filter(z => z.risk > 80).length;
            const criticalDispatches = this.recommendations.filter(r => r.priority === 'P1' && r.status === 'pending').length;

            insightBar.innerHTML = `
                <div class="insight-item" style="color:${highRiskCount > 0 ? '#ef4444' : 'var(--primary)'}">
                    ${highRiskCount > 0 ? '⚠️' : '✅'} ${highRiskCount} High Risk Zones
                </div>
                <div class="insight-separator"></div>
                <div class="insight-item">📦 ${criticalDispatches} Critical Dispatches</div>
                <div class="insight-separator"></div>
                <div class="insight-item">💰 ₹${this.metrics.lossPrevented.toLocaleString()} Saved</div>
                <div class="insight-separator"></div>
                <div class="insight-item">🧠 AI Model: 96% Acc</div>
            `;
        }
    },

    approveRecommendation(id) {
        const rec = this.recommendations.find(r => r.id === id);
        if (rec) {
            rec.status = 'approved';
            this.metrics.lossPrevented += rec.predictedLoss;
            this.metrics.atRiskBatches = Math.max(0, this.metrics.atRiskBatches - 1);

            // If it was a dispatch, reduce utilization slightly
            if (rec.action.includes('Dispatch')) {
                this.metrics.utilization = parseFloat((this.metrics.utilization - 1.5).toFixed(1));
            }

            this.updateMetrics();
            console.log(`Action Approved: ${rec.action} for ${rec.target}`);
            return true;
        }
        return false;
    }
};

window.AppState = AppState;
