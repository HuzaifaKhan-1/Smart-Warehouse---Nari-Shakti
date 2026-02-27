/**
 * AgriFresh Inventory Module
 */
import { AIEngine } from './modules/ai_engine.js';

export const Inventory = {
    batches: [
        { id: 'AF-290', product: 'Tomato', zone: 'C4', qty: 450, unit: 'kg', harvest: '2026-02-18', temp: 19.2, days: 10, source: 'Sangli Farms' },
        { id: 'AF-291', product: 'Onion', zone: 'A2', qty: 1200, unit: 'kg', harvest: '2026-02-20', temp: 14.1, days: 7, source: 'Nashik Local' },
        { id: 'AF-292', product: 'Potato', zone: 'B1', qty: 850, unit: 'kg', harvest: '2026-02-21', temp: 12.5, days: 6, source: 'Pune Agri' },
        { id: 'AF-293', product: 'Tomato', zone: 'C2', qty: 320, unit: 'kg', harvest: '2026-02-22', temp: 18.5, days: 5, source: 'Sangli Farms' },
        { id: 'AF-294', product: 'Grapes', zone: 'D1', qty: 150, unit: 'kg', harvest: '2026-02-23', temp: 10.2, days: 4, source: 'Nashik Export' }
    ],

    init() {
        this.renderTable();
        this.setupFilters();
    },

    renderTable(filter = 'all') {
        const tbody = document.getElementById('inventoryBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        this.batches.forEach(batch => {
            if (filter !== 'all' && batch.product.toLowerCase() !== filter.toLowerCase()) return;

            const pred = AIEngine.predictSpoilage(batch);
            const row = document.createElement('tr');
            if (pred.riskScore > 70) row.className = 'row-high-risk';

            row.innerHTML = `
                <td><span style="font-weight:700; color:var(--text-secondary)">#${batch.id}</span></td>
                <td>
                    <div style="display:flex; align-items:center; gap:10px">
                        <div style="width:30px; height:30px; background:rgba(255,255,255,0.05); border-radius:8px; display:flex; align-items:center; justify-content:center">
                            <i class="fas fa-carrot" style="color:var(--primary)"></i>
                        </div>
                        <span style="font-weight:600">${batch.product}</span>
                    </div>
                </td>
                <td><span class="badge" style="background:rgba(59,130,246,0.1); color:var(--secondary)">${batch.zone}</span></td>
                <td>${batch.qty} ${batch.unit}</td>
                <td>${batch.harvest}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px">
                        <span class="badge ${pred.riskScore > 70 ? 'badge-risk-high' : 'badge-risk-low'}">${pred.riskScore}% Risk</span>
                        <i class="fas fa-brain" style="color:var(--secondary); font-size:0.8rem" title="ML Predicted"></i>
                    </div>
                </td>
                <td><span style="font-weight:700; color:${pred.safeDays < 3 ? 'var(--danger)' : 'var(--primary)'}">${pred.safeDays} Days Left</span></td>
                <td>
                    <div style="display:flex; gap:12px; color:var(--text-secondary)">
                        <i class="fas fa-qrcode" style="cursor:pointer" title="Generate QR"></i>
                        <i class="fas fa-ellipsis-v" style="cursor:pointer"></i>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    setupFilters() {
        const select = document.getElementById('productFilter');
        if (select) {
            select.addEventListener('change', (e) => this.renderTable(e.target.value));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Inventory.init());
