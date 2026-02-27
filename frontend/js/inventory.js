/**
 * AgriFresh Inventory - Batch Management System Logic
 * Production-level AI Warehouse Control
 */

const inventoryData = [
    {
        id: 'AF-290', product: 'Tomato', zone: 'C4', qty: '450 Kg',
        harvest: '2026-02-18', storage: '2026-02-19', expiry: '2026-02-28',
        risk: 87, status: 'In Storage', farmer: 'Ramesh Kumar', health: 42,
        temperature: 18.2, humidity: 72.5, isAnalyzing: false,
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
        temperature: 12.5, humidity: 45.0, isAnalyzing: false,
        history: [{ time: 'Jan 24', action: 'Stored in Bulk', user: 'Admin' }],
        reasons: ['Stable conditions', 'Long shelf life variety'],
        revenue: [{ market: 'Export Hub', profit: '+22%', value: '₹95,000' }]
    },
    {
        id: 'AF-105', product: 'Potato', zone: 'A1', qty: '800 Kg',
        harvest: '2026-02-10', storage: '2026-02-12', expiry: '2026-05-10',
        risk: 8, status: 'In Storage', farmer: 'Anil Singh', health: 98,
        temperature: 10.0, humidity: 85.0, isAnalyzing: false,
        history: [{ time: 'Feb 12', action: 'Cold Storage Entry', user: 'Admin' }],
        reasons: ['Optimal deep cool storage', 'Low respiratory rate'],
        revenue: [{ market: 'Processing Plant', profit: '+15%', value: '₹62,000' }]
    },
    {
        id: 'AF-332', product: 'Tomato', zone: 'C2', qty: '300 Kg',
        harvest: '2026-02-20', storage: '2026-02-21', expiry: '2026-03-05',
        risk: 18, status: 'In Storage', farmer: 'Vijay Patil', health: 88,
        temperature: 14.5, humidity: 64.2, isAnalyzing: false,
        history: [{ time: 'Feb 21', action: 'Allocated Zone C2', user: 'Admin' }],
        reasons: ['Good ventilation'],
        revenue: [{ market: 'Local Market', profit: '+8%', value: '₹28,000' }]
    },
    {
        id: 'AF-982', product: 'Grapes', zone: 'D1', qty: '150 Kg',
        harvest: '2026-02-25', storage: '2026-02-26', expiry: '2026-03-05',
        risk: 64, status: 'Restricted', farmer: 'Meena Sharma', health: 58,
        temperature: 22.0, humidity: 55.0, isAnalyzing: false,
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

        const currentRiskLevel = item.spoilage_risk || (item.risk > 70 ? 'High' : (item.risk > 30 ? 'Medium' : 'Low'));

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
                    <span class="dispatch-pill priority-${currentRiskLevel.toLowerCase()}">${currentRiskLevel}</span>
                    <span style="font-weight:800; color:${getRiskColor(item.risk)}; font-size:0.9rem;">${item.risk}%</span>
                </div>
            </td>
            <td><span class="badge" style="background:#eee; color:#666;">${item.status}</span></td>
            <td style="text-align: right;">
                <div style="display:flex; gap:5px; justify-content:flex-end;">
                    <button class="action-btn" onclick="event.stopPropagation(); showBatchDetails('${item.id}')" style="background:none; border:none; padding:8px; cursor:pointer;" title="View Details">
                        <i class="fas fa-eye" style="color:var(--primary);"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); showQR('${item.id}')" style="background:none; border:none; padding:8px; cursor:pointer;" title="QR Code">
                        <i class="fas fa-qrcode" style="color:var(--primary);"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); analyzeBatch('${item.id}', this)" style="background:none; border:none; padding:8px; cursor:pointer;" title="Dispatch AI Analysis" ${item.isAnalyzing ? 'disabled' : ''}>
                         ${item.isAnalyzing ? '<i class="fas fa-circle-notch fa-spin" style="color:var(--primary);"></i>' : '<i class="fas fa-truck-fast" style="color:var(--primary-accent);"></i>'}
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateSummaryCards();
}

// Feature: AI Backend Integration (STRICT INDEPENDENT)
window.analyzeBatch = async (id, btn) => {
    const item = inventoryData.find(d => d.id === id);
    if (!item || item.isAnalyzing) return;

    item.isAnalyzing = true;
    renderInventory(); // Refresh UI to show loading on this specific batch

    const storageDate = new Date(item.storage || item.harvest);
    const storageDays = Math.max(1, Math.floor((new Date() - storageDate) / (1000 * 60 * 60 * 24)));

    const payload = {
        produce: item.product,
        temperature: item.temperature,
        humidity: item.humidity,
        storage_days: storageDays
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

        const data = await response.json();

        // Data Update (Atomic to this batch)
        item.spoilage_risk = data.spoilage_risk;
        item.remaining_days = data.remaining_days;
        item.priority = data.priority;
        item.recommended_action = data.recommended_action;
        item.confidence = Math.round(data.confidence * 100);
        item.risk = data.spoilage_risk === 'High' ? 85 : (data.spoilage_risk === 'Medium' ? 45 : 15);
        item.human_explanation = `Strict AI Analysis: Batch #${item.id} (${item.product}) shows ${data.spoilage_risk} risk. ${data.recommended_action}. Confidence level: ${item.confidence}%.`;

    } catch (error) {
        console.error("Critical Backend Failure:", error);
        // NO MOCK DATA - Use Error State
        item.recommended_action = "Analysis Error";
        item.human_explanation = `System Error: Could not connect to http://127.0.0.1:8000/analyze. Please ensure the backend server is running.`;
        item.confidence = 0;
    } finally {
        item.isAnalyzing = false;
        renderInventory();
    }
};

function updateSummaryCards() {
    const recContainer = document.getElementById('dispatchRecs');
    if (!recContainer) return;

    const highRisk = [...inventoryData].sort((a, b) => b.risk - a.risk).slice(0, 3);

    recContainer.innerHTML = '';
    highRisk.forEach(item => {
        const riskColor = getRiskColor(item.risk);
        const priorityClass = item.priority ? `pb-${item.priority.toLowerCase()}` : 'pb-p3';
        const priorityLabel = item.priority || 'P?';
        const actionText = item.recommended_action || 'Pending analysis...';
        const confidence = item.confidence || 0;

        const card = document.createElement('div');
        card.className = 'simulator-box glass-panel premium-hover';
        card.style.margin = '0';
        card.style.background = 'white';
        const riskLevelForColor = item.spoilage_risk || (item.risk > 70 ? 'High' : (item.risk > 30 ? 'Medium' : 'Low'));

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div>
                    <span style="font-weight:800; color:var(--text-primary); font-size:1rem;">#${item.id}</span>
                    <div style="font-size:0.75rem; color:var(--text-secondary); font-weight:600;">${item.product} • Zone ${item.zone}</div>
                </div>
                <span class="priority-badge ${priorityClass}">${priorityLabel}</span>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px; background:var(--bg-light); padding:10px; border-radius:8px;">
                <div>
                    <div style="font-size:0.6rem; color:var(--text-secondary); text-transform:uppercase;">Risk Status</div>
                    <div style="font-weight:800; color:${getRiskColor(item.risk)}; font-size:0.85rem;">${item.spoilage_risk || riskLevelForColor}</div>
                </div>
                <div>
                    <div style="font-size:0.6rem; color:var(--text-secondary); text-transform:uppercase;">Days Left</div>
                    <div style="font-weight:800; color:var(--text-primary); font-size:0.85rem;">${item.remaining_days || '--'} Days</div>
                </div>
            </div>

            <div style="margin-bottom:15px;">
                <div style="font-size:0.65rem; color:var(--text-secondary); font-weight:700; display:flex; justify-content:space-between;">
                    <span>AI ACTION:</span>
                    <span>${confidence}% CONFIDENCE</span>
                </div>
                <div style="color:var(--text-primary); font-weight:800; font-size:0.75rem; margin:5px 0;">${actionText}</div>
                <div class="confidence-container">
                    <div class="confidence-fill" style="width: ${confidence}%"></div>
                </div>
            </div>

            <button onclick="analyzeBatch('${item.id}', this)" class="btn-premium" style="width:100%; border-radius:8px; padding:10px; justify-content:center; font-size:0.75rem;" ${item.isAnalyzing ? 'disabled' : ''}>
                <span class="btn-text">${item.isAnalyzing ? 'ANALYZING...' : 'DISPATCH AI'}</span>
                <div class="spinner" style="${item.isAnalyzing ? 'display:block; border-color:white transparent white transparent;' : ''}"></div>
            </button>
        `;
        recContainer.appendChild(card);
    });

    // Update Alert Banner Dynamically
    const highestRiskItem = inventoryData.reduce((prev, current) => (prev.risk > current.risk) ? prev : current);
    if (highestRiskItem && highestRiskItem.risk > 60) {
        document.getElementById('alertSystem').style.display = 'flex';
        document.getElementById('alertText').innerHTML = `<strong>Batch #${highestRiskItem.id} (${highestRiskItem.product})</strong> is at ${highestRiskItem.spoilage_risk || 'HIGH'} risk. ${highestRiskItem.recommended_action || 'Immediate dispatch recommended.'}`;
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
    if (sortField === 'risk-desc') filteredData.sort((a, b) => b.risk - a.risk);
    else if (sortField === 'expiry-asc') filteredData.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
    else if (sortField === 'qty-desc') filteredData.sort((a, b) => parseInt(b.qty) - parseInt(a.qty));
    else if (sortField === 'id-asc') filteredData.sort((a, b) => a.id.localeCompare(b.id));

    renderInventory();
}

// Feature C: Batch Detail View
window.showBatchDetails = (id) => {
    const item = inventoryData.find(d => d.id === id);
    if (!item) return;

    document.getElementById('detBatchID').innerText = `#${item.id}`;
    document.getElementById('detStatus').innerText = item.status;
    document.getElementById('detHealthScore').innerText = Math.round(100 - item.risk);
    document.getElementById('detHealthScore').style.color = getRiskColor(item.risk);

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
    document.getElementById('detAIPredict').innerText = item.human_explanation || `Batch #${item.id} has a ${item.risk}% spoilage risk within the next ${Math.floor((100 - item.risk) / 10)} days.`;

    // Expandable AI Insight
    document.getElementById('aiInsightPanel').style.display = 'none';
    document.getElementById('insightChevron').className = 'fas fa-chevron-down';
    document.getElementById('detHumanExplanation').innerText = item.human_explanation || "High humidity and specific produce respiration factors are accelerating the spoilage risk for this batch.";

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

window.toggleAIInsight = () => {
    const panel = document.getElementById('aiInsightPanel');
    const chevron = document.getElementById('insightChevron');
    if (!panel) return;

    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        chevron.className = 'fas fa-chevron-up';
    } else {
        panel.style.display = 'none';
        chevron.className = 'fas fa-chevron-down';
    }
};

// Feature Impact 2: Dispatch Simulator (STRICT INDEPENDENT)
window.runDispatchSimulator = async () => {
    const id = document.getElementById('detBatchID').innerText.replace('#', '');
    const item = inventoryData.find(d => d.id === id);
    if (!item) return;

    const results = document.getElementById('simulatorResults');
    results.style.display = 'block';
    results.innerHTML = `
        <div style="text-align:center; padding:15px; color:var(--primary);">
            <i class="fas fa-microchip fa-spin"></i> Running Independent Batch Simulation...
        </div>
    `;

    try {
        // Strategy 1: Current metrics
        const payload1 = {
            produce: item.product,
            temperature: item.temperature,
            humidity: item.humidity,
            storage_days: Math.max(1, Math.floor((new Date() - new Date(item.storage)) / (1000 * 60 * 60 * 24)))
        };

        // Strategy 2: Randomized Future stress (Varied per batch)
        const tempVariation = 1.0 + (Math.random() * 2.0); // 1-3 degrees random
        const payLoad2 = {
            produce: item.product,
            temperature: item.temperature + tempVariation,
            humidity: item.humidity + (Math.random() * 8), // 0-8% random hum increase
            storage_days: payload1.storage_days + 3
        };

        const [r1, r2] = await Promise.all([
            fetch('http://127.0.0.1:8000/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload1) }),
            fetch('http://127.0.0.1:8000/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payLoad2) })
        ]);

        if (!r1.ok || !r2.ok) throw new Error("Simulation Backend Error");

        const data1 = await r1.json();
        const data2 = await r2.json();

        const todayRevRaw = item.revenue[0].value.replace('₹', '').replace(',', '');
        const todayRevenue = parseInt(todayRevRaw) || 45000;
        const delayedRev = Math.round(todayRevenue * (data2.spoilage_risk === 'High' ? 0.6 : 0.85));

        results.innerHTML = `
            <div class="simulator-box" style="border-style:solid; border-color:var(--primary); background:white;">
                <div style="font-size:0.75rem; font-weight:800; margin-bottom:10px; color:var(--primary);">
                    <i class="fas fa-play-circle"></i> SCENARIO A: DISPATCH IMMEDIATELY
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="font-size:0.8rem;">Risk Level:</span>
                    <span style="font-weight:700;">${data1.spoilage_risk}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:0.8rem;">Est. Revenue:</span>
                    <span style="font-weight:800;">₹${todayRevenue.toLocaleString()}</span>
                </div>
            </div>
            <div class="simulator-box" style="border-style:solid; border-color:var(--danger); background:#FFF5F5; margin-top:10px;">
                <div style="font-size:0.75rem; font-weight:800; margin-bottom:10px; color:var(--danger);">
                    <i class="fas fa-clock"></i> SCENARIO B: DELAY BY 3 DAYS
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="font-size:0.8rem;">Predicted Risk:</span>
                    <span style="font-weight:700; color:var(--danger);">${data2.spoilage_risk}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:0.8rem;">Potential Loss:</span>
                    <span style="font-weight:800; color:var(--danger);">-₹${(todayRevenue - delayedRev).toLocaleString()}</span>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Simulation Engine Connectivity Error:", e);
        results.innerHTML = `<div style="color:var(--danger); font-size:0.85rem; padding:15px; text-align:center; border:1px solid var(--danger); border-radius:10px;">
            <i class="fas fa-exclamation-circle"></i> Connection Failed: Ensure backend is running at http://127.0.0.1:8000/analyze
        </div>`;
    }
};

// Feature: Live Sensor Streaming (Simulated)
function startSensorStream() {
    const tempEl = document.getElementById('liveTemp');
    const humEl = document.getElementById('liveHum');
    if (!tempEl || !humEl) return;

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
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
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

    // AI analysis is now user-triggered for better demonstration of batch independence
    // inventoryData.filter(d => d.risk > 50).forEach(d => analyzeBatch(d.id));

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
            storage: new Date().toISOString().split('T')[0],
            expiry: '2026-03-25',
            risk: 15,
            status: 'In Storage',
            farmer: 'New Farmer Mob',
            health: 95,
            temperature: 15.0 + Math.random() * 5,
            humidity: 60.0 + Math.random() * 20,
            isAnalyzing: false, // Added individual state tracking
            history: [{ time: 'Today', action: 'Registered', user: 'Admin' }],
            reasons: ['Optimal initial quality'],
            revenue: [{ market: 'Retail Chain B', profit: '+15%', value: '₹45,000' }]
        });

        closeModal('addBatchModal');
        applyFilters();
        showQR(newId);
        analyzeBatch(newId); // Immediate AI analysis for new batch
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
