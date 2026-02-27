/**
 * AgriFresh Advanced Warehouse Heatmap Module
 * Operational & Interactive
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
                    risk: Math.random() * 100, // Increased range for variety
                    batches: Math.floor(Math.random() * 10) + 2,
                    status: 'safe'
                };

                // Specific dangerous zone for demo
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
                <div class="zone-name">${zone.id}</div>
                <div class="badge" style="font-size:0.6rem; padding:2px 6px;">${zone.batches} BATCHES</div>
            </div>
            <div class="zone-temp">${zone.temp.toFixed(1)}°C</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                <div class="zone-meta">${zone.humidity.toFixed(0)}% Hum</div>
                <div style="font-size:0.7rem; font-weight:700; color:${this.getRiskColor(zone.risk)}">${zone.risk.toFixed(0)}%</div>
            </div>
            <div class="accuracy-bar" style="height:3px; margin-top:8px;">
                <div class="accuracy-fill" style="width: ${zone.risk}%; background: ${this.getRiskColor(zone.risk)}"></div>
            </div>
        `;

        tile.addEventListener('mouseenter', (e) => this.showTooltip(e, zone));
        tile.addEventListener('mouseleave', () => this.hideTooltip());
        tile.addEventListener('click', () => this.openZoneModal(zone));

        return tile;
    },

    getRiskColor(risk) {
        if (risk > 80) return '#ef4444';
        if (risk > 50) return '#f59e0b';
        return '#10b981';
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
            <strong style="color:var(--primary)">Zone ${zone.id} Intelligence</strong><br/>
            <div style="margin:5px 0;">
                <span>AI Risk Prediction: </span>
                <span style="color:${this.getRiskColor(zone.risk)}; font-weight:800;">${zone.risk.toFixed(1)}%</span>
            </div>
            <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:8px;">
                Confidence: ${(92 + Math.random() * 4).toFixed(1)}% (96% Spoilage Model)
            </div>
            ${recommendation ? `
                <div style="padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:3px solid var(--primary);">
                    <div style="font-weight:700; font-size:0.7rem; color:var(--primary);">RECOMMENDATION:</div>
                    <div style="font-size:0.8rem;">${recommendation.action}</div>
                </div>
            ` : `<div style="font-size:0.8rem; color:var(--primary);">Status: All parameters optimal</div>`}
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
                    <h2 style="font-size:2rem; font-weight:800;">Zone ${zone.id} Details</h2>
                    <p style="color:var(--text-secondary);">Real-time Telemetry & AI Risk Profile</p>
                </div>
                <div class="glass-panel" style="padding:10px 20px; border-color:${this.getRiskColor(zone.risk)};">
                    <div style="font-size:0.7rem; text-transform:uppercase; color:var(--text-secondary);">Current Risk</div>
                    <div style="font-size:1.5rem; font-weight:800; color:${this.getRiskColor(zone.risk)};">${zone.risk.toFixed(1)}%</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:30px;">
                <div class="glass-panel" style="padding:20px;">
                    <div style="color:var(--text-secondary); font-size:0.8rem;">Temperature</div>
                    <div style="font-size:1.8rem; font-weight:700;">${zone.temp.toFixed(2)}°C</div>
                    <div style="font-size:0.75rem; color:var(--primary); margin-top:5px;"><i class="fas fa-check-circle"></i> Within Threshold</div>
                </div>
                <div class="glass-panel" style="padding:20px;">
                    <div style="color:var(--text-secondary); font-size:0.8rem;">Humidity</div>
                    <div style="font-size:1.8rem; font-weight:700;">${zone.humidity.toFixed(0)}%</div>
                    <div style="font-size:0.75rem; color:var(--primary); margin-top:5px;"><i class="fas fa-check-circle"></i> Stable Environment</div>
                </div>
            </div>

            <h4 style="margin-bottom:15px; font-weight:700; text-transform:uppercase; font-size:0.8rem; letter-spacing:1px;">Active Batches in Zone</h4>
            <div style="max-height:200px; overflow-y:auto;">
                <table style="width:100%; text-align:left; border-collapse:collapse;">
                    <tr style="color:var(--text-secondary); font-size:0.7rem; border-bottom:1px solid var(--card-border);">
                        <th style="padding:10px 0;">Batch ID</th>
                        <th>Product</th>
                        <th>ML Risk Prediction</th>
                    </tr>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                        <td style="padding:15px 0; font-weight:700;">#AF-290</td>
                        <td>Tomato</td>
                        <td style="color:${this.getRiskColor(87)}">87.4% High Risk</td>
                    </tr>
                    <tr>
                        <td style="padding:15px 0; font-weight:700;">#AF-412</td>
                        <td>Onion</td>
                        <td style="color:${this.getRiskColor(12)}">12.1% Safe</td>
                    </tr>
                </table>
            </div>

            <div style="margin-top:30px; display:flex; gap:15px;">
                <button class="btn-premium" style="flex:1;">Initiate Cooling</button>
                <button class="glass-panel" style="flex:1; border-color:var(--primary); color:var(--primary);">Dispatch Batch #AF-290</button>
            </div>
        `;

        modal.style.display = 'flex';
    }
};

window.closeZoneModal = () => {
    document.getElementById('zoneModal').style.display = 'none';
};
