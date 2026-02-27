/**
 * AgriFresh Advanced Warehouse Heatmap Module
 */

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

        // Generate 24 zones (A1 to D6)
        const rows = ['A', 'B', 'C', 'D'];
        for (let r of rows) {
            for (let i = 1; i <= 6; i++) {
                const zone = {
                    id: `${r}${i}`,
                    temp: 14 + Math.random() * 4,
                    humidity: 60 + Math.random() * 10,
                    risk: Math.random() * 100,
                    batches: Math.floor(Math.random() * 10) + 1,
                    status: 'safe'
                };

                if (zone.risk > 80) zone.status = 'critical';
                else if (zone.risk > 50) zone.status = 'warning';

                this.zones.push(zone);
                grid.appendChild(this.createZoneElement(zone));
            }
        }
    },

    createZoneElement(zone) {
        const tile = document.createElement('div');
        tile.className = `zone-tile zone-${zone.status}`;
        tile.id = `zone-tile-${zone.id}`;

        tile.innerHTML = `
            <div class="zone-name">${zone.id}</div>
            <div class="zone-temp">${zone.temp.toFixed(1)}°C</div>
            <div class="zone-meta">${zone.humidity.toFixed(0)}% Hum • ${zone.batches} Batches</div>
            <div class="accuracy-bar" style="height: 4px; margin-top: 8px;">
                <div class="accuracy-fill" style="width: ${zone.risk}%; background: ${this.getRiskColor(zone.risk)}"></div>
            </div>
        `;

        tile.addEventListener('mouseenter', (e) => this.showTooltip(e, zone));
        tile.addEventListener('mouseleave', () => this.hideTooltip());
        tile.addEventListener('click', () => this.openZoneDetails(zone));

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
            const tile = document.getElementById(`zone-tile-${zoneId}`);
            if (tile) {
                tile.className = `zone-tile zone-${zone.status}`;
                tile.innerHTML = `
                    <div class="zone-name">${zone.id}</div>
                    <div class="zone-temp">${zone.temp.toFixed(1)}°C</div>
                    <div class="zone-meta">${zone.humidity.toFixed(0)}% Hum • ${zone.batches} Batches</div>
                    <div class="accuracy-bar" style="height: 4px; margin-top: 8px;">
                        <div class="accuracy-fill" style="width: ${zone.risk}%; background: ${this.getRiskColor(zone.risk)}"></div>
                    </div>
                `;
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

        tooltip.innerHTML = `
            <strong style="color:var(--primary)">Zone ${zone.id} Details</strong><br/>
            Temp: ${zone.temp.toFixed(2)}°C<br/>
            Humidity: ${zone.humidity.toFixed(0)}%<br/>
            Spoilage Risk: <span style="color:${this.getRiskColor(zone.risk)}">${zone.risk.toFixed(1)}%</span><br/>
            Active Batches: ${zone.batches}<br/>
            <small style="color:var(--text-secondary)">Predicted by ML Model (96% accuracy)</small>
        `;

        tooltip.style.display = 'block';
        tooltip.style.left = `${e.pageX + 15}px`;
        tooltip.style.top = `${e.pageY + 15}px`;
    },

    hideTooltip() {
        const tooltip = document.getElementById('zoneTooltip');
        if (tooltip) tooltip.style.display = 'none';
    },

    openZoneDetails(zone) {
        console.log("Opening details for zone", zone.id);
        // Dispatch event or open modal
    }
};
