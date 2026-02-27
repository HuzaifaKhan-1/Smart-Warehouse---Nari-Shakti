/**
 * AgriFresh Simulation Module
 * Triggers dramatic demo scenarios
 */
import { WarehouseHeatmap } from './heatmap.js';
import { AIEngine } from './ai_engine.js';

export const Simulation = {
    isActive: false,

    triggerTemperatureSpike() {
        this.isActive = true;
        console.log("🔥 Simulation: Triggering Temperature Spike in Zone C-4...");

        // 1. Update Heatmap
        WarehouseHeatmap.updateZone('C4', {
            temp: 21.4,
            risk: 89.5,
            status: 'critical'
        });

        // 2. Play Alert Sound (optional/visual)
        this.showPopupAlert('Temperature Breach: Zone C-4', 'Critical spike detected (21.4°C). Spoilage risk increased to 89%.');

        // 3. Update Dashboard Stats
        const avgTempEl = document.getElementById('avgTemp');
        if (avgTempEl) {
            avgTempEl.innerText = "18.2°C";
            avgTempEl.style.color = "#ef4444";
        }

        // 4. Update AI Recommendations
        AIEngine.renderDecisionCards('aiDecisionCenter');

        // 5. Update Impact Metrics
        this.animateValue('lossPrevented', 42500, 43800, 2000);
    },

    showPopupAlert(title, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'glass-panel';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '40px';
        alertDiv.style.right = '40px';
        alertDiv.style.padding = '20px';
        alertDiv.style.borderColor = '#ef4444';
        alertDiv.style.zIndex = '5000';
        alertDiv.style.width = '350px';
        alertDiv.style.boxShadow = '0 0 40px rgba(239, 68, 68, 0.3)';

        alertDiv.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px; color:#ef4444">
                <i class="fas fa-exclamation-triangle" style="font-size:1.5rem"></i>
                <h4 style="margin:0">${title}</h4>
            </div>
            <p style="margin-top:10px; font-size:0.9rem">${message}</p>
        `;

        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    },

    animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            obj.innerHTML = `₹${current.toLocaleString()}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
};
