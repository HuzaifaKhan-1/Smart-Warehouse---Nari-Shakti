/**
 * AgriFresh Demo Simulation Module
 * Visual Event Trigger (Light Theme)
 */
import { AppState } from './state.js';
import { WarehouseHeatmap } from './heatmap.js';
import { AIEngine } from './ai_engine.js';

export const Simulation = {
    triggerTemperatureSpike() {
        console.log("DEMO: Triggering Critical Temperature Spike in Zone D-1");

        // 1. Update State Logically
        const targetZoneId = 'D1';
        const zoneUpdate = {
            temp: 22.4,
            humidity: 78,
            risk: 88,
            status: 'critical'
        };

        // 2. Add a new Urgent Recommendation
        const newRec = {
            id: 'REC-' + Date.now(),
            target: 'Grade A Grapes (Lot #AF-295)',
            reason: 'Critical temperature rise (22°C) in Zone D-1 detected. 88% Spoilage Risk.',
            action: 'Immediate Dispatch Recommended',
            priority: 'P1',
            confidence: 96,
            predictedLoss: 58000,
            zoneId: 'D1',
            status: 'pending'
        };

        AppState.recommendations.unshift(newRec);

        // 3. Trigger UI Updates
        WarehouseHeatmap.updateZone(targetZoneId, zoneUpdate);
        AIEngine.renderDecisionCards('aiDecisionCenter');

        // 4. Update Overview Metrics
        AppState.metrics.atRiskBatches += 1;
        AppState.metrics.status = 'Action Required';
        AppState.updateMetrics();

        // 5. Visual Notification
        this.dramaticAlert();
        AIEngine.showNotification(
            "CRITICAL ALERT",
            "Zone D-1 temperature is rising dangerously. AI suggests immediate dispatch of Grapes to prevent loss.",
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
