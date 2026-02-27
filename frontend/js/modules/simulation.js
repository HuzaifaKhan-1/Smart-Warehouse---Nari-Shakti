/**
 * AgriFresh Simulation Module
 * Triggers dramatic demo scenarios connected to central state
 */
import { WarehouseHeatmap } from './heatmap.js';
import { AIEngine } from './ai_engine.js';
import { AppState } from './state.js';

export const Simulation = {
    isActive: false,

    triggerTemperatureSpike() {
        if (this.isActive) return;
        this.isActive = true;

        console.log("🔥 Simulation: Critical Breach Scenario Initiated...");

        // 1. Update State
        AppState.metrics.avgTemp = 18.2;
        AppState.metrics.atRiskBatches += 1;
        AppState.metrics.status = 'Critical Anomaly';

        // 2. Add New Emergency Recommendation
        const emergencyRec = {
            id: 'SIM-' + Date.now(),
            target: 'Batch #AF-295 (Grapes)',
            reason: 'Critical Temp Breach (>18°C) in Zone D-1. Rapid spoilage expected within 36 hours.',
            action: 'Emergency Dispatch',
            priority: 'P1',
            confidence: 98,
            predictedLoss: 68000,
            zoneId: 'D1',
            status: 'pending'
        };
        AppState.recommendations.unshift(emergencyRec);

        // 3. Update Heatmap Zone D1
        WarehouseHeatmap.updateZone('D1', {
            temp: 22.8,
            risk: 94.2,
            status: 'critical'
        });

        // 4. Force AI Re-render
        AIEngine.renderDecisionCards('aiDecisionCenter');

        // 5. Update Metrics UI
        AppState.updateMetrics();

        // 6. Visual Alert & Notification
        this.dramaticAlert();
        AIEngine.showNotification(
            "CRITICAL AREA DETECTED",
            "Zone D-1 has exceeded 22°C. AI Spoilage Model (96% Acc) recommends immediate dispatch of Grapes Lot #AF-295.",
            "critical"
        );
    },

    dramaticAlert() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(239, 68, 68, 0.1)';
        overlay.style.border = '20px solid rgba(239, 68, 68, 0.3)';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '99999';
        overlay.style.animation = 'pulseRed 1s infinite alternate';

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulseRed {
                from { opacity: 0.2; }
                to { opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
            this.isActive = false;
        }, 5000);
    }
};
