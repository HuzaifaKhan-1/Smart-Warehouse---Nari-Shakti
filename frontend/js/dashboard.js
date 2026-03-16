/**
 * AgriFresh Main Dashboard Module
 * Coordinates State, Heatmap, AI, and Simulation
 */
import { WarehouseHeatmap } from './modules/heatmap.js';
import { AIEngine } from './modules/ai_engine.js';
import { Simulation } from './modules/simulation.js';
import { AppState } from './modules/state.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State Load
    AppState.fetchDashboardData();
    updateClock();
    setInterval(updateClock, 1000);

    // 2. Initialize Operational Modules
    WarehouseHeatmap.init('heatmapGrid');
    AIEngine.init();

    // 3. Setup Simulation & Refresh Triggers
    const demoBtn = document.getElementById('demoModeBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            Simulation.triggerTemperatureSpike();
        });
    }

    const citySelector = document.getElementById('citySelector');
    if (citySelector) {
        citySelector.addEventListener('change', async (e) => {
            const city = e.target.value;
            const hubText = document.getElementById('currentHubText');
            if (hubText) hubText.innerText = `${city} Hub`;

            // Simulation shortcut: randomize data on city change
            AppState.metrics.lossPrevented += Math.floor(Math.random() * 50000);
            await AppState.fetchDashboardData();
            AIEngine.renderDecisionCards('aiDecisionCenter');
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('fa-spin');
            await AppState.fetchDashboardData();
            AIEngine.renderDecisionCards('aiDecisionCenter');
            setTimeout(() => icon.classList.remove('fa-spin'), 600);
        });
    }

    // 4. Trend Chart Overlays
    const btn24h = document.getElementById('btn24h');
    const btn7d = document.getElementById('btn7d');

    if (btn24h && btn7d) {
        btn24h.addEventListener('click', () => {
            updateTrendData('24h');
            btn24h.style.background = 'var(--primary)';
            btn24h.style.color = 'white';
            btn7d.style.background = 'transparent';
            btn7d.style.color = 'var(--text-secondary)';
        });

        btn7d.addEventListener('click', () => {
            updateTrendData('7d');
            btn7d.style.background = 'var(--primary)';
            btn7d.style.color = 'white';
            btn24h.style.background = 'transparent';
            btn24h.style.color = 'var(--text-secondary)';
        });
    }

    // 5. Initialize Analytics
    initDashboardCharts();

    // 5. Hero Accuracy Animation
    setTimeout(() => {
        const spoilageAcc = document.getElementById('spoilageAccuracy');
        const optAcc = document.getElementById('optAccuracy');
        if (spoilageAcc) spoilageAcc.style.width = '96%';
        if (optAcc) optAcc.style.width = '92%';
    }, 800);

    // 6. Live Heartbeat
    setInterval(async () => {
        simulateLiveTelemetry();
        await AppState.fetchDashboardData(); // Sync with backend every 5s
        AIEngine.renderDecisionCards('aiDecisionCenter');
    }, 5000);
});

function simulateLiveTelemetry() {
    // Minor flux in avg values
    AppState.metrics.avgTemp = parseFloat((14 + Math.random() * 0.5).toFixed(1));

    // Randomly fluctuate one zone for visual feedback
    if (WarehouseHeatmap.zones.length > 0) {
        const randomZone = WarehouseHeatmap.zones[Math.floor(Math.random() * WarehouseHeatmap.zones.length)];
        const newVal = randomZone.temp + (Math.random() * 0.4 - 0.2);
        WarehouseHeatmap.updateZone(randomZone.id, { temp: newVal });
    }

    AppState.updateMetrics();
}

function updateClock() {
    const clockEl = document.getElementById('liveClock');
    if (clockEl) {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString();
    }
}

async function updateTrendData(range) {
    if (!window.envTrendChart) return;

    try {
        const response = await fetch(`/api/sensors/history?range=${range}`);
        const result = await response.json();

        window.envTrendChart.data.labels = result.labels;
        window.envTrendChart.data.datasets[0].data = result.temps;
        
        // Update source label if needed
        console.log(`Trends updated from: ${result.source}`);
        
        window.envTrendChart.update();
    } catch (err) {
        console.error("Failed to load trend data:", err);
    }
}

function initDashboardCharts() {
    const ctxTrend = document.getElementById('envTrendChart');
    if (ctxTrend) {
        window.envTrendChart = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
                datasets: [{
                    label: 'Temperature Trend',
                    data: [13.1, 13.4, 14.2, 14.8, 14.2, 13.8, 14.2],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#10b981'
                }, {
                    label: 'Safe Threshold',
                    data: [16, 16, 16, 16, 16, 16, 16],
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#06080f',
                        titleColor: '#94a3b8',
                        padding: 12,
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255,255,255,0.03)' },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    }
                }
            }
        });
    }
}
