/**
 * AgriFresh Demo Simulation Module
 * Visual Event Trigger (Light Theme)
 */
import { AppState } from './state.js';
import { WarehouseHeatmap } from './heatmap.js';
import { AIEngine } from './ai_engine.js';

export const Simulation = {
    triggerTemperatureSpike() {
        console.log("DEMO: Triggering Critical Event Across Warehouse");

        // 1. Update Multiple Zones to create a "Heatmap Fire"
        const criticalZones = ['A2', 'C4', 'D1'];
        criticalZones.forEach(id => {
            WarehouseHeatmap.updateZone(id, {
                temp: 24.5 + Math.random() * 5,
                humidity: 82,
                risk: 92,
                status: 'critical'
            });
        });

        // 2. Add multiple Urgent Recommendations to AI Decision Center
        const events = [
            { target: 'Grade A Grapes (Lot #AF-295)', loss: 58000, zone: 'D1' },
            { target: 'Export Tomatoes (Lot #AF-290)', loss: 42000, zone: 'C4' },
            { target: 'Spring Onions (Lot #AF-112)', loss: 12500, zone: 'A2' }
        ];

        events.forEach(ev => {
            const newRec = {
                id: 'REC-' + Math.random(),
                target: ev.target,
                reason: `CRITICAL: Sensor in Zone ${ev.zone} reading 24°C+. Spoilage imminent within 4 hours.`,
                action: 'Emergency Dispatch to Tier-1 Market',
                priority: 'P1',
                confidence: 99,
                predictedLoss: ev.loss,
                zoneId: ev.zone,
                status: 'pending'
            };
            AppState.recommendations.unshift(newRec);
        });

        // 3. Trigger UI Updates
        AIEngine.renderDecisionCards('aiDecisionCenter');

        // 4. Force Metrics to Red Alert
        AppState.metrics.atRiskBatches += 3;
        AppState.metrics.status = 'CRITICAL ALERT';
        AppState.updateMetrics();

        // 5. Visual Drama
        this.dramaticAlert();
        AIEngine.showNotification(
            "CRITICAL WAREHOUSE FAILURE",
            "Multiple zone temperature breaches detected. AI has automatically calculated emergency dispatch routes.",
            "critical"
        );
    },

    dramaticAlert() {
        const body = document.body;
        body.style.transition = 'background 0.3s ease';

        // Soft red flash for light theme
        body.style.background = '#FFEBEE';

        setTimeout(() => {
            body.style.background = 'linear-gradient(135deg, #F4FBF6 0%, #E8F5E9 100%)';
        }, 1000);

        // Highlight the AI center
        const aiCenter = document.getElementById('aiDecisionCenter');
        if (aiCenter) {
            aiCenter.style.transform = 'scale(1.02)';
            aiCenter.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            setTimeout(() => aiCenter.style.transform = 'scale(1)', 500);
        }
    }
};
