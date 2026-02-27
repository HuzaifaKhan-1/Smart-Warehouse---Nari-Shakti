/**
 * AgriFresh Analytics Logic (Light Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
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
                    borderWidth: 3
                },
                {
                    label: 'Available Supply',
                    data: [400, 480, 550, 600, 720, 800, 850, 900],
                    borderColor: '#F9A825',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#37474F', font: { weight: 'bold' } }
                }
            },
            scales: {
                y: { grid: { color: '#E8F5E9' }, ticks: { color: '#546E7A' } },
                x: { grid: { display: false }, ticks: { color: '#546E7A' } }
            }
        }
    });

    // 2. Capacity Utilization Pie
    const ctxUtil = document.getElementById('utilizationPieChart').getContext('2d');
    new Chart(ctxUtil, {
        type: 'doughnut',
        data: {
            labels: ['Tomato', 'Onion', 'Potato', 'Grapes', 'Available'],
            datasets: [{
                data: [38, 22, 15, 10, 15],
                backgroundColor: ['#2E7D32', '#66BB6A', '#FFF176', '#81C784', '#F5F5F5'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#37474F', padding: 20 }
                }
            },
            cutout: '70%'
        }
    });
});
