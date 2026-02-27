/**
 * AgriFresh Main Dashboard Module
 */
import { WarehouseHeatmap } from './modules/heatmap.js';
import { AIEngine } from './modules/ai_engine.js';
import { Simulation } from './modules/simulation.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Heatmap
    WarehouseHeatmap.init('heatmapGrid');

    // 2. Initialize AI Engine
    AIEngine.renderDecisionCards('aiDecisionCenter');

    // 3. Initialize Charts
    initDashboardCharts();

    // 4. Setup Simulation
    const demoBtn = document.getElementById('demoModeBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            Simulation.triggerTemperatureSpike();
        });
    }

    // 5. Animate accuracy bars on load
    setTimeout(() => {
        document.getElementById('spoilageAccuracy').style.width = '96%';
        document.getElementById('optAccuracy').style.width = '92%';
    }, 500);
});

function initDashboardCharts() {
    const ctxRisk = document.getElementById('riskDistChart');
    if (ctxRisk) {
        new Chart(ctxRisk, {
            type: 'doughnut',
            data: {
                labels: ['Stable', 'Monitoring', 'Action Required'],
                datasets: [{
                    data: [82, 12, 6],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                cutout: '70%'
            }
        });
    }

    const ctxTrend = document.getElementById('tempTrendChart');
    if (ctxTrend) {
        new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Avg Warehouse Temp',
                    data: [13.2, 13.5, 14.1, 14.8, 14.2, 13.9],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }
}
