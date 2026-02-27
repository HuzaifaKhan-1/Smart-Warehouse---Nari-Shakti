// AgriFresh Analytics Logic
document.addEventListener('DOMContentLoaded', () => {
    initAnalytics();

    // Smooth scroll for transitions
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.add('page-transition');
        });
    });
});

let charts = {};

async function initAnalytics() {
    console.log("Initializing AgriFresh AI Analytics...");

    const mockData = getMockData();
    renderCharts(mockData);

    // Try live fetch
    try {
        const response = await fetch('http://localhost:5000/api/analytics/summary');
        if (response.ok) {
            const liveData = await response.json();
            // In a real app, update logic would go here
        }
    } catch (e) {
        console.warn("Backend unavailable, using enterprise mock suite.");
    }
}

function renderCharts(data) {
    renderDemandSupply(data.demandSupply);
    renderUtilization(data.utilization);
    renderLossReduction(data.loss);
}

function renderDemandSupply(data) {
    const ctx = document.getElementById('demandSupplyChart').getContext('2d');
    if (charts.ds) charts.ds.destroy();

    charts.ds = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Market Demand',
                    data: data.demand,
                    borderColor: '#3b82f6',
                    background: 'rgba(59, 130, 246, 0.05)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6'
                },
                {
                    label: 'Warehouse Supply',
                    data: data.supply,
                    borderColor: '#10b981',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter' } } }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function renderUtilization(data) {
    const ctx = document.getElementById('utilizationChart').getContext('2d');
    if (charts.util) charts.util.destroy();

    charts.util = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', 'rgba(255,255,255,0.05)'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 10 } }
            }
        }
    });
}

function renderLossReduction(data) {
    const ctx = document.getElementById('lossReductionChart').getContext('2d');
    if (charts.loss) charts.loss.destroy();

    charts.loss = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Baseline (Pre-AI)',
                    data: data.before,
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderDash: [5, 5],
                    fill: false
                },
                {
                    label: 'Optimized (AI Fresh)',
                    data: data.after,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function getMockData() {
    return {
        demandSupply: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            demand: [420, 480, 520, 780, 810, 850, 980, 1100],
            supply: [400, 450, 500, 580, 620, 700, 750, 820]
        },
        utilization: {
            labels: ['Tomato', 'Onion', 'Potato', 'Empty'],
            values: [38, 22, 15, 25]
        },
        loss: {
            labels: ['Dec', 'Jan', 'Feb', 'Mar'],
            before: [180000, 175000, 190000, 185000],
            after: [180000, 140000, 95000, 72000]
        }
    };
}

function exportAnalytics() {
    const btn = document.querySelector('.btn-premium');
    const originalContent = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Report...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Report Downloaded';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }, 2000);
    }, 1500);
}
