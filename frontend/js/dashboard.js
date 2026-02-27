// AgriFresh Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    initHeatmap();
    initCharts();
    setupDemoMode();
});

function initHeatmap() {
    const heatmap = document.getElementById('warehouseHeatmap');
    if (!heatmap) return;

    // Generate 30 zones
    for (let i = 1; i <= 30; i++) {
        const cell = document.createElement('div');
        cell.className = 'zone-cell';
        cell.id = `zone-${i}`;
        
        // Random initial states
        const rand = Math.random();
        if (rand > 0.9) {
            cell.classList.add('zone-danger');
            cell.innerHTML = '<i class="fas fa-exclamation-triangle" style="font-size: 0.8rem;"></i>';
        } else if (rand > 0.7) {
            cell.classList.add('zone-warning');
        } else {
            cell.classList.add('zone-safe');
        }

        cell.title = `Zone ${i} | Temp: ${(12 + Math.random() * 5).toFixed(1)}°C`;
        
        cell.addEventListener('mouseover', (e) => {
             // Show tooltip or update info panel
        });

        heatmap.appendChild(cell);
    }
}

let sensorChart;
function initCharts() {
    const ctx = document.getElementById('sensorChart').getContext('2d');
    if (!ctx) return;

    sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [13.5, 14.1, 13.8, 14.2, 14.5, 14.2],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
        }
    });
}

function setupDemoMode() {
    const btn = document.getElementById('demoModeBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Simulate a spike
        alert("DEMO MODE ACTIVATED: Simulating Temperature Spike in Zone C-4...");
        
        const zone4 = document.getElementById('zone-4');
        if (zone4) {
            zone4.className = 'zone-cell zone-danger';
            zone4.style.boxShadow = '0 0 15px #ef4444';
        }

        document.getElementById('avgTemp').innerText = "18.5°C";
        document.getElementById('avgTemp').style.color = "#ef4444";

        // Update Chart
        sensorChart.data.datasets[0].data.push(18.5);
        sensorChart.data.labels.push('16:00');
        sensorChart.update();

        // Trigger AI Recommendation update
        const aiRecs = document.getElementById('aiRecs');
        aiRecs.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: flex-start; margin-bottom: 15px; border: 1px solid #ef4444; padding: 10px; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">
                <div style="color: #ef4444;">
                    <i class="fas fa-triangle-exclamation"></i>
                </div>
                <div>
                    <p style="font-weight: 600; color: #ef4444;">CRITICAL: Zone C-4 Spike</p>
                    <p style="font-size: 0.85rem;">Temperature exceeded 18°C. AI Agent suggests immediate cooling adjustment and dispatching Batch #AF-290.</p>
                </div>
            </div>
        ` + aiRecs.innerHTML;

        // Show Notification (simulated)
        if (Notification.permission === "granted") {
            new Notification("AgriFresh Alert", { body: "Temperature Anomaly in Zone C-4" });
        }
    });
}
