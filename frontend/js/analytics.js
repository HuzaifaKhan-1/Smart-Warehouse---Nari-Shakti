/**
 * AgriFresh Analytics Logic
 * Enhanced for Enterprise AI Intelligence Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    // Shared chart options for consistent look
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: '#546E7A',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: { weight: '600', size: 11 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1B5E20',
                bodyColor: '#37474F',
                borderColor: '#E8F5E9',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
                ticks: { color: '#90A4AE', font: { size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#90A4AE', font: { size: 10 } }
            }
        }
    };

    // 1. Demand vs Supply Chart
    const ctxDemand = document.getElementById('demandSupplyChart').getContext('2d');
    new Chart(ctxDemand, {
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
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#2E7D32',
                    pointBorderWidth: 2
                },
                {
                    label: 'Available Supply',
                    data: [400, 480, 550, 600, 720, 800, 850, 900],
                    borderColor: '#F9A825',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: commonOptions
    });

    // 2. Capacity Utilization Pie
    const ctxUtil = document.getElementById('utilizationPieChart').getContext('2d');
    new Chart(ctxUtil, {
        type: 'doughnut',
        data: {
            labels: ['Tomato', 'Onion', 'Potato', 'Mango', 'Available'],
            datasets: [{
                data: [35, 25, 15, 10, 15],
                backgroundColor: ['#2E7D32', '#66BB6A', '#FFF176', '#81C784', '#F5F5F5'],
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverOffset: 15
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                legend: {
                    position: 'bottom',
                    labels: { color: '#37474F', padding: 20, usePointStyle: true }
                }
            },
            cutout: '75%'
        }
    });

    // 3. Loss Reduction Timeline (New Chart)
    const ctxLoss = document.getElementById('lossReductionChart').getContext('2d');
    new Chart(ctxLoss, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Loss Before AI (%)',
                    data: [28, 26, 30, 29, 27, 28],
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    borderColor: '#D12F2F',
                    borderWidth: 1,
                    borderRadius: 5
                },
                {
                    label: 'Loss After AI (%)',
                    data: [12, 10, 8, 7, 5, 4],
                    backgroundColor: '#2E7D32',
                    borderRadius: 5
                },
                {
                    label: 'Revenue Saved (₹)',
                    type: 'line',
                    data: [15, 18, 22, 28, 35, 42],
                    borderColor: '#0288D1',
                    borderWidth: 3,
                    yAxisID: 'y1',
                    pointRadius: 5,
                    pointBackgroundColor: '#fff',
                    tension: 0.5
                }
            ]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Waste Percentage (%)', font: { size: 10 } }
                },
                y1: {
                    position: 'right',
                    grid: { display: false },
                    title: { display: true, text: 'Revenue Saved (Lakhs)', font: { size: 10 } }
                }
            }
        }
    });
});
