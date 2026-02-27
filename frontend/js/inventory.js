/**
 * AgriFresh Inventory - Batch Management System Logic
 * Production-level AI Warehouse Control
 */

const inventoryData = [
    { 
        id: 'AF-290', product: 'Tomato', zone: 'C4', qty: '450 Kg', 
        harvest: '2026-02-18', storage: '2026-02-19', expiry: '2026-02-28', 
        risk: 87, status: 'In Storage', farmer: 'Ramesh Kumar', health: 42,
        history: [
            { time: 'Feb 19', action: 'Received at Hub', user: 'Admin' },
            { time: 'Feb 19', action: 'Zone C4 Allocation', user: 'AI Suggester' },
            { time: 'Feb 21', action: 'Quality Check: Pass', user: 'QA Team' }
        ],
        reasons: ['Temperature fluctuation in Zone C4', 'High moisture content at harvest', 'Near expiry threshold (3 days)'],
        revenue: [
            { market: 'Wholesale Market A', profit: '+12%', value: '₹42,000' },
            { market: 'Retail Chain B', profit: '+18%', value: '₹48,500' }
        ]
    },
    { 
        id: 'AF-412', product: 'Onion', zone: 'B2', qty: '1200 Kg', 
        harvest: '2026-01-22', storage: '2026-01-24', expiry: '2026-04-15', 
        risk: 12, status: 'In Storage', farmer: 'Sita Devi', health: 94,
        history: [{ time: 'Jan 24', action: 'Stored in Bulk', user: 'Admin' }],
        reasons: ['Stable conditions', 'Long shelf life variety'],
        revenue: [{ market: 'Export Hub', profit: '+22%', value: '₹95,000' }]
    },
    { 
        id: 'AF-105', product: 'Potato', zone: 'A1', qty: '800 Kg', 
        harvest: '2026-02-10', storage: '2026-02-12', expiry: '2026-05-10', 
        risk: 8, status: 'In Storage', farmer: 'Anil Singh', health: 98,
        history: [{ time: 'Feb 12', action: 'Cold Storage Entry', user: 'Admin' }],
        reasons: ['Optimal deep cool storage', 'Low respiratory rate'],
        revenue: [{ market: 'Processing Plant', profit: '+15%', value: '₹62,000' }]
    },
    { 
        id: 'AF-332', product: 'Tomato', zone: 'C2', qty: '300 Kg', 
        harvest: '2026-02-20', storage: '2026-02-21', expiry: '2026-03-05', 
        risk: 18, status: 'In Storage', farmer: 'Vijay Patil', health: 88,
        history: [{ time: 'Feb 21', action: 'Allocated Zone C2', user: 'Admin' }],
        reasons: ['Good ventilation'],
        revenue: [{ market: 'Local Market', profit: '+8%', value: '₹28,000' }]
    },
    { 
        id: 'AF-982', product: 'Grapes', zone: 'D1', qty: '150 Kg', 
        harvest: '2026-02-25', storage: '2026-02-26', expiry: '2026-03-05', 
        risk: 64, status: 'Restricted', farmer: 'Meena Sharma', health: 58,
        history: [{ time: 'Feb 26', action: 'Ambient Zone D1', user: 'Admin' }],
        reasons: ['Short shelf life', 'High ambient temp'],
        revenue: [{ market: 'Winery Chain', profit: '+30%', value: '₹55,000' }]
    }
];

let filteredData = [...inventoryData];

function renderInventory() {
    const tableBody = document.getElementById('inventoryBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = (e) => {
            if (e.target.closest('button')) return;
            showBatchDetails(item.id);
        };

        const riskColor = getRiskColor(item.risk);
        const riskLevel = item.risk > 70 ? 'High' : (item.risk > 30 ? 'Medium' : 'Low');
        const badgeClass = `priority-${riskLevel.toLowerCase()}`;
        
        row.innerHTML = `
            <td style="font-weight: 700; color: var(--text-primary);">#${item.id}</td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:30px; height:30px; border-radius:50%; background:var(--bg-light); display:flex; align-items:center; justify-content:center; color:var(--primary);">
                        <i class="fas ${getProductIcon(item.product)}"></i>
                    </div>
                    ${item.product}
                </div>
            </td>
            <td style="font-weight: 600;">Zone ${item.zone}</td>
            <td>${item.qty}</td>
            <td style="color:var(--text-secondary); font-size:0.85rem;">${formatDate(item.harvest)}</td>
            <td style="color:var(--text-secondary); font-size:0.85rem;">${formatDate(item.expiry)}</td>
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="dispatch-pill ${badgeClass}">${riskLevel}</span>
                    <span style="font-weight:800; color:${riskColor}; font-size:0.9rem;">${item.risk}%</span>
                </div>
            </td>
            <td><span class="badge" style="background:#eee; color:#666;">${item.status}</span></td>
            <td style="text-align: right;">
                <div style="display:flex; gap:5px; justify-content:flex-end;">
                    <button class="action-btn" onclick="showBatchDetails('${item.id}')" style="background:none; border:none; padding:8px; cursor:pointer;" title="View Details">
                        <i class="fas fa-eye" style="color:var(--primary);"></i>
                    </button>
                    <button class="action-btn" onclick="showQR('${item.id}')" style="background:none; border:none; padding:8px; cursor:pointer;" title="QR Code">
                        <i class="fas fa-qrcode" style="color:var(--primary);"></i>
                    </button>
                    <button class="action-btn" style="background:none; border:none; padding:8px; cursor:pointer;" title="Dispatch">
                         <i class="fas fa-truck-fast" style="color:var(--primary-accent);"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateSummaryCards();
}

function updateSummaryCards() {
    const recContainer = document.getElementById('dispatchRecs');
    if (!recContainer) return;

    const highRisk = inventoryData.filter(d => d.risk > 60).sort((a,b) => b.risk - a.risk).slice(0, 3);
    
    recContainer.innerHTML = '';
    highRisk.forEach(item => {
        const card = document.createElement('div');
        card.className = 'simulator-box';
        card.style.margin = '0';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <span style="font-weight:800; color:var(--text-primary);">#${item.id}</span>
                <span class="dispatch-pill priority-high">PRIORITY</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;">${item.product} in Zone ${item.zone}</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.7rem; font-weight:700;">RISK: ${item.risk}%</span>
                <button onclick="showBatchDetails('${item.id}')" style="font-size:0.7rem; border:none; background:none; color:var(--primary); font-weight:800; cursor:pointer;">DISPATCH AI</button>
            </div>
        `;
        recContainer.appendChild(card);
    });

    // Update Alert Banner
    const critical = inventoryData.find(d => d.risk > 80);
    if (critical) {
        document.getElementById('alertSystem').style.display = 'flex';
        document.getElementById('alertText').innerHTML = `Batch <strong>#${critical.id} (${critical.product})</strong> expected to enter CRITICAL RISK in 14 hours. Immediate dispatch recommended.`;
    }
}

// Feature B: Filters & Search
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const riskField = document.getElementById('riskFilter').value;
    const zoneField = document.getElementById('zoneFilter').value;
    const typeField = document.getElementById('typeFilter').value;
    const sortField = document.getElementById('sortOption').value;

    filteredData = inventoryData.filter(item => {
        const matchesSearch = item.id.toLowerCase().includes(search) || 
                            item.product.toLowerCase().includes(search) || 
                            item.zone.toLowerCase().includes(search);
        
        let matchesRisk = true;
        if (riskField === 'high') matchesRisk = item.risk > 70;
        else if (riskField === 'medium') matchesRisk = item.risk >= 30 && item.risk <= 70;
        else if (riskField === 'low') matchesRisk = item.risk < 30;

        const matchesZone = zoneField === 'all' || item.zone.startsWith(zoneField);
        const matchesType = typeField === 'all' || item.product === typeField;

        return matchesSearch && matchesRisk && matchesZone && matchesType;
    });

    // Sorting
    if (sortField === 'risk-desc') filteredData.sort((a,b) => b.risk - a.risk);
    else if (sortField === 'expiry-asc') filteredData.sort((a,b) => new Date(a.expiry) - new Date(b.expiry));
    else if (sortField === 'qty-desc') filteredData.sort((a,b) => parseInt(b.qty) - parseInt(a.qty));
    else if (sortField === 'id-asc') filteredData.sort((a,b) => a.id.localeCompare(b.id));

    renderInventory();
}

// Feature C: Batch Detail View
window.showBatchDetails = (id) => {
    const item = inventoryData.find(d => d.id === id);
    if (!item) return;

    document.getElementById('detBatchID').innerText = `#${item.id}`;
    document.getElementById('detStatus').innerText = item.status;
    document.getElementById('detHealthScore').innerText = item.health;
    document.getElementById('detHealthScore').style.color = getRiskColor(100 - item.health);
    
    document.getElementById('detFarmer').innerText = item.farmer;
    document.getElementById('detProduce').innerText = `${item.product} (Premium)`;
    document.getElementById('detZone').innerText = `Zone ${item.zone}`;
    document.getElementById('detQty').innerText = item.qty;

    // Timeline
    const timeline = document.getElementById('storageTimeline');
    timeline.innerHTML = item.history.map(h => `
        <div style="display:flex; gap:15px; margin-bottom:15px; position:relative; padding-left:20px;">
            <div style="position:absolute; left:0; top:5px; width:10px; height:10px; border-radius:50%; background:var(--primary);"></div>
            <div style="font-size:0.8rem;">
                <div style="font-weight:700;">${h.action}</div>
                <div style="color:var(--text-secondary); font-size:0.7rem;">${h.time} | by ${h.user}</div>
            </div>
        </div>
    `).join('');

    // AI Prediction
    document.getElementById('detAIPredict').innerText = `Batch #${item.id} has a ${item.risk}% spoilage risk within the next ${Math.floor(item.health/10)} days if storage conditions remain current.`;
    
    // AI Explainability
    const reasonsList = document.getElementById('detRiskReasons');
    reasonsList.innerHTML = item.reasons.map(r => `<li>${r}</li>`).join('');

    // Revenue Options
    const revContainer = document.getElementById('revenueOptions');
    revContainer.innerHTML = item.revenue.map(r => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-radius:10px; background:var(--bg-light); margin-bottom:8px;">
            <div>
                <div style="font-size:0.85rem; font-weight:700;">${r.market}</div>
                <div style="font-size:0.7rem; color:var(--primary); font-weight:800;">${r.profit} Profit</div>
            </div>
            <div style="font-weight:800; font-size:1.1rem;">${r.value}</div>
        </div>
    `).join('');

    document.getElementById('simulatorResults').style.display = 'none';
    document.getElementById('detailModal').style.display = 'flex';
};

// Feature Impact 2: Dispatch Simulator
window.runDispatchSimulator = () => {
    const loader = document.querySelector('#simulatorResults');
    loader.style.display = 'block';
    loader.style.opacity = '0.5';
    setTimeout(() => {
        loader.style.opacity = '1';
    }, 500);
};

// Feature: Live Sensor Streaming (Simulated)
function startSensorStream() {
    const tempEl = document.getElementById('liveTemp');
    const humEl = document.getElementById('liveHum');

    setInterval(() => {
        const t = (14 + Math.random() * 0.5).toFixed(1);
        const h = (63 + Math.random() * 1).toFixed(1);
        
        tempEl.innerHTML = `${t}°C <i class="fas fa-caret-up value-up" style="font-size:0.8rem;"></i>`;
        humEl.innerHTML = `${h}% <i class="fas fa-caret-down value-down" style="font-size:0.8rem;"></i>`;
        
        tempEl.classList.add('pulse');
        setTimeout(() => tempEl.classList.remove('pulse'), 500);
    }, 3000);
}

// Helpers
function getRiskColor(risk) {
    if (risk > 70) return '#D32F2F';
    if (risk > 30) return '#F9A825';
    return '#2E7D32';
}

function getProductIcon(product) {
    switch (product.toLowerCase()) {
        case 'tomato': return 'fa-apple-whole';
        case 'onion': return 'fa-lemon';
        case 'potato': return 'fa-carrot';
        case 'grapes': return 'fa-grape-fruit';
        default: return 'fa-leaf';
    }
}

function formatDate(dateStr) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

window.showQR = (id) => {
    const modal = document.getElementById('qrModal');
    const container = document.getElementById('qrContainer');
    document.getElementById('qrTitle').innerText = `Batch #${id} Identity`;
    container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=AGRI-FRESH-${id}&color=2E7D32" style="display:block; width:100%;">`;
    modal.style.display = 'flex';
};

window.closeModal = (id) => {
    document.getElementById(id).style.display = 'none';
};

window.openAddModal = () => {
    document.getElementById('batchForm').reset();
    document.getElementById('formHarvestDate').valueAsDate = new Date();
    document.getElementById('addBatchModal').style.display = 'flex';
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    startSensorStream();

    document.getElementById('searchInput').oninput = applyFilters;
    document.getElementById('riskFilter').onchange = applyFilters;
    document.getElementById('zoneFilter').onchange = applyFilters;
    document.getElementById('typeFilter').onchange = applyFilters;
    document.getElementById('sortOption').onchange = applyFilters;

    document.getElementById('batchForm').onsubmit = (e) => {
        e.preventDefault();
        const newId = 'AF-' + Math.floor(100 + Math.random() * 900);
        const produce = document.getElementById('formProduce').value;
        const qty = document.getElementById('formQty').value + ' Kg';
        const zone = document.getElementById('formZone').value;
        const harvest = document.getElementById('formHarvestDate').value;

        inventoryData.unshift({
            id: newId,
            product: produce,
            zone: zone,
            qty: qty,
            harvest: harvest,
            expiry: '2026-03-25',
            risk: Math.floor(Math.random() * 20),
            status: 'In Storage',
            farmer: 'New Farmer Mob',
            health: 95,
            history: [{ time: 'Today', action: 'Registered', user: 'Admin' }],
            reasons: ['Optimal initial quality'],
            revenue: [{ market: 'Retail Chain B', profit: '+15%', value: '₹--' }]
        });

        closeModal('addBatchModal');
        applyFilters();
        showQR(newId);
    };

    // Auto-calculate expiry placeholder
    document.getElementById('formProduce').onchange = (e) => {
        const produce = e.target.value;
        let days = 14;
        if (produce === 'Onion') days = 90;
        if (produce === 'Potato') days = 120;
        if (produce === 'Grapes') days = 7;
        
        const date = new Date();
        date.setDate(date.getDate() + days);
        document.getElementById('formAutoExpiry').innerText = formatDate(date);
        document.getElementById('zoneRecText').innerHTML = `Based on produce type and capacity, **Zone ${produce === 'Tomato' ? 'C4' : 'A1'}** is recommended for maximum shelf life.`;
    };
});
