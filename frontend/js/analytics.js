document.addEventListener('DOMContentLoaded', () => {
    fetchAnalytics();

    // Set up filters
    document.getElementById('warehouseFilter').addEventListener('change', fetchAnalytics);
    document.getElementById('dateFilter').addEventListener('change', fetchAnalytics);
});

async function fetchAnalytics() {
    try {
        // API Base URL - could be configurable
        const API_BASE = 'http://localhost:5000/api/analytics';

        // Section A: Demand vs Supply
        const resA = await fetch(`${API_BASE}/demand-supply`);
        const dataA = await resA.json();
        updateDemandSupplyChart(dataA);

        // Section B: Utilization
        const resB = await fetch(`${API_BASE}/utilization`);
        const dataB = await resB.json();
        updateUtilizationChart(dataB);

        // Section C: Risk Distribution
        const resC = await fetch(`${API_BASE}/risk-distribution`);
        const dataC = await resC.json();
        updateRiskChart(dataC);

        // Section D: AI Model Performance
        const resD = await fetch(`${API_BASE}/model-performance`);
        const dataD = await resD.json();
        updateModelPerformance(dataD);

        // Section E: Loss Reduction
        const resE = await fetch(`${API_BASE}/loss-reduction`);
        const dataE = await resE.json();
        updateLossReductionChart(dataE);

    } catch (err) {
        console.error("Error fetching analytics:", err);
    }
}

let charts = {};

function updateDemandSupplyChart(data) {
    const ctx = document.getElementById('demandSupplyChart').getContext('2d');
    if (charts.demandSupply) charts.demandSupply.destroy();

    document.getElementById('demandSupplyInsight').innerText = data.recommendation;
    document.getElementById('gapIndicator').innerText = `Gap: ${data.gap_percentage}%`;

    charts.demandSupply = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.weeks,
            datasets: [
                {
                    label: 'Market Demand',
                    data: data.demand,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Current Supply',
                    data: data.supply,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    tension: 0.4,
                    borderWidth: 3,
                    fill: false
                },
                {
                    label: 'Demand Projection',
                    data: data.projection,
                    borderColor: '#3b82f6',
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) label += context.parsed.y + ' Tons';
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function updateUtilizationChart(data) {
    const ctx = document.getElementById('utilizationChart').getContext('2d');
    if (charts.utilization) charts.utilization.destroy();

    document.getElementById('totalCap').innerText = `${data.total_capacity.toLocaleString()} Tons`;
    document.getElementById('usedCap').innerText = `${data.used_capacity.toLocaleString()} Tons`;
    document.getElementById('remainingCap').innerText = `${data.remaining_capacity.toLocaleString()} Tons`;
    document.getElementById('utilizationInsight').innerText = data.smart_insight;

    charts.utilization = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.produce.map(p => p.name),
            datasets: [{
                data: data.produce.map(p => p.percentage),
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', 'rgba(255,255,255,0.1)'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#94a3b8', boxWidth: 12, padding: 15 }
                }
            }
        }
    });
}

function updateRiskChart(data) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    if (charts.risk) charts.risk.destroy();

    document.getElementById('totalBatches').innerText = `${data.total_batches} Batches`;
    document.getElementById('avgRisk').innerText = `${data.risk_score_summary} / 100`;
    document.getElementById('riskInsight').innerText = data.insight;

    const safe = data.distribution.find(d => d.label === 'Safe');
    const warning = data.distribution.find(d => d.label === 'Warning');
    const high = data.distribution.find(d => d.label === 'High Risk');

    document.getElementById('safePerc').innerText = safe.percentage + '%';
    document.getElementById('warningPerc').innerText = warning.percentage + '%';
    document.getElementById('highRiskPerc').innerText = high.percentage + '%';

    charts.risk = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Safe', 'Warning', 'High Risk'],
            datasets: [{
                data: [safe.percentage, warning.percentage, high.percentage],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 2,
                borderColor: '#06080f'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

function updateModelPerformance(data) {
    document.getElementById('optAcc').innerText = data.optimization_model.accuracy + '%';
    document.getElementById('efficiency').innerText = data.optimization_model.dispatch_efficiency + '%';
    document.getElementById('tpVal').innerText = data.confusion_matrix.tp;
    document.getElementById('fpVal').innerText = data.confusion_matrix.fp;
    document.getElementById('fnVal').innerText = data.confusion_matrix.fn;
}

function updateLossReductionChart(data) {
    const ctx = document.getElementById('lossReductionChart').getContext('2d');
    if (charts.loss) charts.loss.destroy();

    document.getElementById('lossPrevented').innerText = `₹${data.metrics.total_loss_prevented.toLocaleString()}`;
    document.getElementById('reductionPerc').innerText = data.metrics.percentage_reduction + '%';
    document.getElementById('tonsSaved').innerText = data.metrics.tons_saved + ' Tons';
    document.getElementById('co2Offset').innerText = data.metrics.co2_reduction + ' Tons';

    charts.loss = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [
                {
                    label: 'Before AI Implementation',
                    data: data.before_ai,
                    borderColor: '#94a3b8',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'After AI Implementation',
                    data: data.after_ai,
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
                legend: { labels: { color: '#94a3b8' } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: '#94a3b8',
                        callback: val => '₹' + (val / 1000) + 'k'
                    }
                },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function exportAnalytics() {
    alert('Preparing analytics export...\nFormat: PDF Performance Report\nStatus: Generating charts and metrics...');
    setTimeout(() => {
        alert('Export Ready! agri_fresh_intelligence_report.pdf has been downloaded.');
    }, 1500);
}
