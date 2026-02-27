/**
 * AgriFresh Advanced Warehouse Heatmap Module
 * Operational & Interactive (Light Theme)
 */
import { AppState } from './state.js';

export const WarehouseHeatmap = {
    zones: [],
    containerId: 'heatmapGrid',

    init(containerId) {
        this.containerId = containerId;
        this.renderInitialGrid();
    },

    renderInitialGrid() {
        const grid = document.getElementById(this.containerId);
        if (!grid) return;
        grid.innerHTML = '';
        this.zones = [];

        const rows = ['A', 'B', 'C', 'D'];
        for (let r of rows) {
            for (let i = 1; i <= 6; i++) {
                const zone = {
                    id: `${r}${i}`,
                    temp: 14 + Math.random() * 4,
                    humidity: 55 + Math.random() * 10,
                    risk: Math.random() * 80,
                    batches: Math.floor(Math.random() * 10) + 2,
                    status: 'safe'
                };

                if (zone.id === 'C4') {
                    zone.temp = 14.5;
                    zone.risk = 12;
                }

                if (zone.risk > 80) zone.status = 'critical';
                else if (zone.risk > 50) zone.status = 'warning';

                this.zones.push(zone);
                grid.appendChild(this.createZoneElement(zone));
            }
        }
        AppState.zones = this.zones;
    },

    createZoneElement(zone) {
        const tile = document.createElement('div');
        tile.className = `zone-tile zone-${zone.status}`;
        tile.id = `zone-tile-${zone.id}`;

        tile.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div class="zone-name" style="color:var(--primary); font-weight:800;">Zone ${zone.id}</div>
                <div class="badge" style="font-size:0.6rem; padding:2px 6px; background:rgba(0,0,0,0.05); color:var(--text-secondary);">${zone.batches} BATCHES</div>
            </div>
            <div style="display:flex; align-items:baseline; gap:5px; margin:10px 0;">
                <span class="zone-temp">${zone.temp.toFixed(1)}°C</span>
                <i class="fas fa-thermometer-half" style="font-size:0.8rem; color:var(--text-secondary);"></i>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:0.75rem; color:var(--text-secondary);"><i class="fas fa-droplet"></i> ${zone.humidity.toFixed(0)}%</div>
                <div style="font-size:0.75rem; font-weight:700; color:${this.getRiskColor(zone.risk)}">${zone.risk.toFixed(0)}% Risk</div>
            </div>
            <div style="height:4px; background:rgba(0,0,0,0.05); border-radius:10px; margin-top:10px; overflow:hidden;">
                <div style="width:${zone.risk}%; height:100%; background:${this.getRiskColor(zone.risk)}; border-radius:10px;"></div>
            </div>
        `;

        tile.addEventListener('mouseenter', (e) => this.showTooltip(e, zone));
        tile.addEventListener('mouseleave', () => this.hideTooltip());
        tile.addEventListener('click', () => this.openZoneModal(zone));

        return tile;
    },

    getRiskColor(risk) {
        if (risk > 80) return '#D32F2F'; // Danger
        if (risk > 50) return '#F9A825'; // Warning
        return '#2E7D32'; // Success
    },

    updateZone(zoneId, data) {
        const zone = this.zones.find(z => z.id === zoneId);
        if (zone) {
            Object.assign(zone, data);

            if (zone.risk > 80) zone.status = 'critical';
            else if (zone.risk > 50) zone.status = 'warning';
            else zone.status = 'safe';

            const tile = document.getElementById(`zone-tile-${zoneId}`);
            if (tile) {
                const newTile = this.createZoneElement(zone);
                tile.parentNode.replaceChild(newTile, tile);
            }
        }
    },

    showTooltip(e, zone) {
        let tooltip = document.getElementById('zoneTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'zoneTooltip';
            tooltip.className = 'tooltip';
            document.body.appendChild(tooltip);
        }

        const recommendation = AppState.recommendations.find(r => r.zoneId === zone.id);

        tooltip.innerHTML = `
            <strong style="color:var(--primary); display:block; margin-bottom:8px;">Zone ${zone.id} Insights</strong>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>Current Risk Condition:</span>
                <span style="color:${this.getRiskColor(zone.risk)}; font-weight:800;">${zone.risk.toFixed(1)}%</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:12px;">
                Calculated by 96% Spoilage Model
            </p>
            ${recommendation ? `
                <div style="padding:10px; background:var(--bg-light); border-radius:8px; border-left:3px solid var(--primary);">
                    <div style="font-weight:700; font-size:0.7rem; color:var(--primary); text-transform:uppercase;">Advisor Suggestion:</div>
                    <div style="font-size:0.8rem; color:var(--text-primary);">${recommendation.action}</div>
                </div>
            ` : `<div style="font-size:0.8rem; color:var(--primary); font-weight:600;"><i class="fas fa-check-circle"></i> Environment is optimal</div>`}
        `;

        tooltip.style.display = 'block';
        tooltip.style.left = `${e.pageX + 15}px`;
        tooltip.style.top = `${e.pageY + 15}px`;
    },

    hideTooltip() {
        const tooltip = document.getElementById('zoneTooltip');
        if (tooltip) tooltip.style.display = 'none';
    },

    openZoneModal(zone) {
        const modal = document.getElementById('zoneModal');
        const content = document.getElementById('modalBody');
        if (!modal || !content) return;

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px;">
                <div>
                    <h2 style="font-size:2rem; font-weight:800; color:var(--primary);">Zone ${zone.id} Profile</h2>
                    <p style="color:var(--text-secondary);">Real-time monitoring for agricultural safety</p>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.7rem; text-transform:uppercase; color:var(--text-secondary);">Health Score</div>
                    <div style="font-size:1.8rem; font-weight:800; color:${this.getRiskColor(zone.risk)};">${(100 - zone.risk).toFixed(0)}/100</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:30px;">
                <div style="background:var(--bg-light); padding:20px; border-radius:16px; border:1px solid #C8E6C9;">
                    <div style="color:var(--text-secondary); font-size:0.8rem;">Current Temperature</div>
                    <div style="font-size:1.8rem; font-weight:800; color:var(--text-primary);">${zone.temp.toFixed(2)}°C</div>
                    <div style="font-size:0.75rem; color:var(--primary); margin-top:5px;"><i class="fas fa-info-circle"></i> Optimal for current inventory</div>
                </div>
                <div style="background:var(--bg-light); padding:20px; border-radius:16px; border:1px solid #C8E6C9;">
                    <div style="color:var(--text-secondary); font-size:0.8rem;">Air Humidity</div>
                    <div style="font-size:1.8rem; font-weight:800; color:var(--text-primary);">${zone.humidity.toFixed(0)}%</div>
                    <div style="font-size:0.75rem; color:var(--primary); margin-top:5px;"><i class="fas fa-droplet"></i> Stable conditions detected</div>
                </div>
            </div>

            <h4 style="margin-bottom:15px; font-weight:700; color:var(--text-primary);">Stored Batches</h4>
            <div style="max-height:200px; overflow-y:auto; border:1px solid var(--card-border); border-radius:12px;">
                <table style="width:100%; text-align:left; border-collapse:collapse;">
                    <tr style="background:var(--bg-light); font-size:0.75rem; color:var(--text-secondary);">
                        <th style="padding:12px;">Batch ID</th>
                        <th>Product</th>
                        <th style="padding-right:12px;">Condition</th>
                    </tr>
                    <tr style="border-bottom:1px solid var(--card-border);">
                        <td style="padding:15px 12px; font-weight:700;">#AF-290</td>
                        <td>Tomato</td>
                        <td style="color:${this.getRiskColor(87)}; font-weight:700;">Weak</td>
                    </tr>
                    <tr>
                        <td style="padding:15px 12px; font-weight:700;">#AF-412</td>
                        <td>Onion</td>
                        <td style="color:${this.getRiskColor(12)}; font-weight:700;">Good</td>
                    </tr>
                </table>
            </div>

            <div style="margin-top:30px; display:flex; gap:15px;">
                <button class="btn-premium" style="flex:1;">Adjust Zone Environment</button>
                <button style="flex:1; background:white; border:1px solid var(--card-border); border-radius:12px; font-weight:700; cursor:pointer;">View Batch Timeline</button>
            </div>
        `;

        modal.style.display = 'flex';
    }
};

window.closeZoneModal = () => {
    document.getElementById('zoneModal').style.display = 'none';
};
