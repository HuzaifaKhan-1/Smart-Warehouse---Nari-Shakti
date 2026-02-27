/**
 * AgriFresh Analytics Logic
 * Enhanced for Enterprise AI Intelligence Dashboard
 */

let demandChart, lossChart, utilChart;

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    renderSpoilageForecast();
    setupEventListeners();
});

function setupEventListeners() {
    const timeSelect = document.getElementById('timeRangeSelect');
    const cropSelect = document.getElementById('cropTypeSelect');
    const exportBtn = document.getElementById('exportBtn');

    if (timeSelect) timeSelect.addEventListener('change', updateAllData);
    if (cropSelect) cropSelect.addEventListener('change', updateAllData);

    if (exportBtn) {
        exportBtn.onclick = () => {
            exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

            // Create a pseudo-report content
            const csvContent = "data:text/csv;charset=utf-8,"
                + "Metric,Value,Status\n"
                + "Loss Prevented,₹" + document.getElementById('summaryLoss').innerText + ",Active\n"
                + "Efficiency," + document.getElementById('summaryEff').innerText + ",Optimized\n"
                + "Carbon Offset," + document.getElementById('valCarbon').innerText + ",Verified\n";

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "AgriFresh_AI_Intelligence_Report.csv");

            setTimeout(() => {
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                exportBtn.innerHTML = '<i class="fas fa-check"></i> Report Downloaded';
                setTimeout(() => exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export Report', 2000);
            }, 1500);
        };
    }
}

function updateAllData() {
    // 1. Update Charts
    renderSpoilageForecast();

    demandChart.data.datasets[0].data = demandChart.data.datasets[0].data.map(v => v + (Math.random() * 60 - 30));
    demandChart.data.datasets[1].data = demandChart.data.datasets[1].data.map(v => v + (Math.random() * 40 - 20));
    demandChart.update();

    lossChart.data.datasets[0].data = lossChart.data.datasets[0].data.map(v => Math.max(20, v + (Math.random() * 6 - 3)));
    lossChart.data.datasets[1].data = lossChart.data.datasets[1].data.map(v => Math.max(2, v + (Math.random() * 3 - 1)));
    lossChart.update();

    // 2. Update Intelligence Summary Panel (Numbers)
    const newLoss = 200000 + Math.floor(Math.random() * 100000);
    document.getElementById('summaryLoss').innerText = '₹' + newLoss.toLocaleString();

    const newEff = (90 + Math.random() * 8).toFixed(1);
    document.getElementById('summaryEff').innerText = newEff + '%';

    const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
    document.getElementById('summaryZone').innerText = zones[Math.floor(Math.random() * zones.length)];

    // 3. Update Impact Grid (Numbers)
    document.getElementById('valCarbon').innerText = (4 + Math.random() * 2).toFixed(1) + 'T';
    document.getElementById('valMarket').innerText = '₹' + (1.5 + Math.random()).toFixed(2) + 'M';
    document.getElementById('valLoss').innerText = (60 + Math.random() * 10).toFixed(1) + '%';

    const exits = ['Zone C-4', 'Zone A-2', 'Zone B-1', 'Zone D-3'];
    document.getElementById('valExit').innerText = exits[Math.floor(Math.random() * exits.length)];
}

function renderSpoilageForecast() {
    const container = document.getElementById('spoilageForecast');
    if (!container) return;

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    container.innerHTML = days.map(day => {
        const risk = Math.floor(Math.random() * 25) + (day === 'FRI' ? 60 : 5);
        const color = risk > 70 ? '#D12F2F' : (risk > 30 ? '#F9A825' : '#2E7D32');
        const glow = risk > 70 ? 'box-shadow: 0 0 15px rgba(209, 47, 47, 0.3); border-color: #feb2b2;' : '';

        return `
            <div class="day-card" style="${glow}">
                <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-secondary);">${day}</span>
                <div class="risk-indicator" style="background: ${color}; width: 10px; height: 10px; margin: 12px auto;"></div>
                <div style="font-weight: 800; color: ${risk > 70 ? color : 'inherit'}">${risk}%</div>
                <div style="font-size: 0.5rem; text-transform: uppercase; margin-top: 4px; opacity: 0.6;">Forecast</div>
            </div>
        `;
    }).join('');
}

function initCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: { color: '#546E7A', usePointStyle: true, pointStyle: 'circle', font: { weight: '600', size: 11 } }
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#1B5E20',
                bodyColor: '#37474F',
                borderColor: '#E8F5E9',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                displayColors: true
            }
        },
        scales: {
            y: { grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false }, ticks: { color: '#90A4AE', font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { color: '#90A4AE', font: { size: 10 } } }
        }
    };

    // 1. Demand vs Supply Chart
    const ctxDemand = document.getElementById('demandSupplyChart').getContext('2d');
    demandChart = new Chart(ctxDemand, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            datasets: [
                {
                    label: 'Market Demand',
                    data: [450, 520, 610, 780, 850, 920, 1050, 1100],
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(46, 125, 50, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#2E7D32',
                    pointBorderWidth: 2
                },
                {
                    label: 'Available Supply',
                    data: [400, 480, 550, 600, 720, 800, 850, 900],
                    borderColor: '#F9A825',
                    borderDash: [8, 5],
                    tension: 0.4,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0
                }
            ]
        },
        options: commonOptions
    });

    // 2. Loss Reduction Timeline
    const ctxLoss = document.getElementById('lossReductionChart').getContext('2d');
    lossChart = new Chart(ctxLoss, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Loss Without AgriFresh (%)',
                    data: [32, 28, 30, 31, 29, 32],
                    backgroundColor: 'rgba(211, 47, 47, 0.4)',
                    borderRadius: 8
                },
                {
                    label: 'Current AI-Optimized Loss (%)',
                    data: [14, 11, 9, 7, 5, 4],
                    backgroundColor: '#10b981',
                    borderRadius: 8
                },
                {
                    label: 'Efficiency Gain',
                    type: 'line',
                    data: [20, 25, 30, 45, 60, 85],
                    borderColor: '#7E57C2',
                    borderWidth: 4,
                    yAxisID: 'y1',
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#fff'
                }
            ]
        },
        options: {
            ...commonOptions,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Waste (%)' } },
                y1: { position: 'right', grid: { display: false }, title: { display: true, text: 'Revenue Impact' } }
            }
        }
    });

    // 3. Utilization Doughnut
    const ctxUtil = document.getElementById('utilizationPieChart').getContext('2d');
    utilChart = new Chart(ctxUtil, {
        type: 'doughnut',
        data: {
            labels: ['Tomato', 'Onion', 'Potato', 'Grapes', 'Available'],
            datasets: [{
                data: [35, 25, 15, 10, 15],
                backgroundColor: ['#e11d48', '#a855f7', '#92400e', '#10b981', '#f1f5f9'],
                borderWidth: 0,
                hoverOffset: 20
            }]
        },
        options: {
            ...commonOptions,
            cutout: '80%',
            plugins: { ...commonOptions.plugins, legend: { position: 'bottom' } }
        }
    });
}
