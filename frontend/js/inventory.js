/**
 * AgriFresh Inventory Module (Light Theme)
 */
import { AIEngine } from './modules/ai_engine.js';

const inventoryData = [
    { id: 'AF-290', product: 'Tomato', zone: 'C4', qty: '450 Kg', harvest: 'Feb 18, 2026', risk: 87, life: '2 Days' },
    { id: 'AF-412', product: 'Onion', zone: 'B2', qty: '1200 Kg', harvest: 'Jan 22, 2026', risk: 12, life: '45 Days' },
    { id: 'AF-105', product: 'Potato', zone: 'A1', qty: '800 Kg', harvest: 'Feb 10, 2026', risk: 8, life: '60 Days' },
    { id: 'AF-332', product: 'Tomato', zone: 'C2', qty: '300 Kg', harvest: 'Feb 20, 2026', risk: 18, life: '14 Days' },
    { id: 'AF-982', product: 'Grapes', zone: 'D1', qty: '150 Kg', harvest: 'Feb 25, 2026', risk: 64, life: '5 Days' }
];

function renderInventory() {
    const tableBody = document.getElementById('inventoryBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    inventoryData.forEach(item => {
        const row = document.createElement('tr');

        const riskColor = getRiskColor(item.risk);
        const riskLevel = item.risk > 80 ? 'High' : (item.risk > 50 ? 'Warning' : 'Low');
        const badgeBg = item.risk > 80 ? '#FFEBEE' : (item.risk > 50 ? '#FFF8E1' : '#E8F5E9');
        const badgeColor = item.risk > 80 ? '#D32F2F' : (item.risk > 50 ? '#F9A825' : '#2E7D32');

        row.innerHTML = `
            <td style="font-weight: 700; color: var(--text-primary);">#${item.id}</td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:30px; height:30px; border-radius:50%; background:var(--bg-light); display:flex; align-items:center; justify-content:center; color:var(--primary); font-size:0.8rem;">
                        <i class="fas ${getProductIcon(item.product)}"></i>
                    </div>
                    ${item.product}
                </div>
            </td>
            <td style="font-weight: 600;">Zone ${item.zone}</td>
            <td>${item.qty}</td>
            <td style="color:var(--text-secondary);">${item.harvest}</td>
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="badge" style="background:${badgeBg}; color:${badgeColor};">${riskLevel}</span>
                    <span style="font-weight:800; color:${riskColor}; font-size:0.9rem;">${item.risk}%</span>
                </div>
            </td>
            <td style="font-weight: 700;">${item.life}</td>
            <td style="text-align: right;">
                <button class="action-btn" onclick="showQR('${item.id}')" style="background:none; border:none; padding:8px; cursor:pointer;" title="View QR Code">
                    <i class="fas fa-qrcode" style="color:var(--primary);"></i>
                </button>
                <button class="action-btn" style="background:none; border:none; padding:8px; cursor:pointer;" title="Marketplace">
                     <i class="fas fa-shopping-basket" style="color:var(--primary);"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getRiskColor(risk) {
    if (risk > 80) return '#D32F2F';
    if (risk > 50) return '#F9A825';
    return '#2E7D32';
}

function getProductIcon(product) {
    switch (product.toLowerCase()) {
        case 'tomato': return 'fa-apple-whole';
        case 'onion': return 'fa-lemon';
        case 'potato': return 'fa-carrot';
        default: return 'fa-leaf';
    }
}

window.showQR = (id) => {
    const modal = document.getElementById('qrModal');
    const container = document.getElementById('qrContainer');
    document.getElementById('qrTitle').innerText = `Batch #${id} Identity`;
    container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${id}&color=37474F" style="display:block;">`;
    modal.style.display = 'flex';
};

document.addEventListener('DOMContentLoaded', renderInventory);
