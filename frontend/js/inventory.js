/**
 * AgriFresh Inventory - Batch Management System Logic
 * Production-level AI Warehouse Control
 */

// Central state store
let inventoryData = [
    {
        id: 'AF-290', product: 'Tomato', zone: 'C4', qty: '450 Kg',
        harvest: '2026-02-18', storage: '2026-02-19', expiry: '2026-02-28',
        risk: 87, status: 'In Storage', farmer: 'Ramesh Kumar', health: 42,
        temperature: 18.2, humidity: 72.5, isAnalyzing: false,
        aiResult: null,
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
        aiResult: null,
        history: [{ time: 'Jan 24', action: 'Stored in Bulk', user: 'Admin' }],
        reasons: ['Stable conditions', 'Long shelf life variety'],
        revenue: [{ market: 'Export Hub', profit: '+22%', value: '₹95,000' }]
    },
    {
        id: 'AF-105', product: 'Potato', zone: 'A1', qty: '800 Kg',
        harvest: '2026-02-10', storage: '2026-02-12', expiry: '2026-05-10',
        risk: 10, status: 'In Storage', farmer: 'Anil Singh', health: 98,
        temperature: 10.0, humidity: 85.0, isAnalyzing: false,
        aiResult: null,
        history: [{ time: 'Feb 12', action: 'Cold Storage Entry', user: 'Admin' }],
        reasons: ['Optimal deep cool storage', 'Low respiratory rate'],
        revenue: [{ market: 'Processing Plant', profit: '+15%', value: '₹62,000' }]
    },
    {
        id: 'AF-332', product: 'Tomato', zone: 'C2', qty: '300 Kg',
        harvest: '2026-02-20', storage: '2026-02-21', expiry: '2026-03-05',
        risk: 18, status: 'In Storage', farmer: 'Vijay Patil', health: 88,
        temperature: 14.5, humidity: 64.2, isAnalyzing: false,
        aiResult: null,
        history: [{ time: 'Feb 21', action: 'Allocated Zone C2', user: 'Admin' }],
        reasons: ['Good ventilation'],
        revenue: [{ market: 'Local Market', profit: '+8%', value: '₹28,000' }]
    },
    {
        id: 'AF-982', product: 'Grapes', zone: 'D1', qty: '150 Kg',
        harvest: '2026-02-25', storage: '2026-02-26', expiry: '2026-03-05',
        risk: 64, status: 'Restricted', farmer: 'Meena Sharma', health: 58,
        temperature: 22.0, humidity: 55.0, isAnalyzing: false,
        aiResult: null,
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
        row.setAttribute('data-key', item.id); // Mandatory Requirement: unique ID key
        row.onclick = (e) => {
            if (e.target.closest('button')) return;
            showBatchDetails(item.id);
        };

        const hasResult = item.aiResult !== null;
        const currentRiskLabel = hasResult ? item.aiResult.spoilage_risk : 'Pending';
        const pillClass = hasResult ? `priority-${currentRiskLabel.toLowerCase()}` : 'priority-pending';

        row.innerHTML = `
            <td style="font-weight: 700; color: var(--text-primary);">#${item.id}</td>
            <td>
                <div style="display:flex; align-items:center; gap:8px; font-weight:600; color:var(--text-primary);">
                    ${item.product}
                </div>
            </td>
            <td style="font-weight: 600;">Zone ${item.zone}</td>
            <td>${item.qty}</td>
            <td style="color:var(--text-secondary); font-size:0.85rem;">${formatDate(item.harvest)}</td>
            <td style="color:var(--text-secondary); font-size:0.85rem;">${formatDate(item.expiry)}</td>
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="dispatch-pill ${pillClass}">${currentRiskLabel}</span>
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
                    <button class="action-btn" onclick="event.stopPropagation(); confirmDispatch('${item.id}')" style="background:none; border:none; padding:8px; cursor:pointer;" title="Execute Dispatch">
                        <i class="fas fa-truck-fast" style="color:var(--primary-accent);"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateSummaryCards();
}

/**
 * AI DISPATCH CONTROLLER - STRICT BATCH BINDING
 */
window.dispatchAI = async (batchId) => {
    console.log("Dispatching:", batchId); // Mandatory Requirement: Identity Verification

    // START: Atomic State Update (Loading state)
    inventoryData = inventoryData.map(b =>
        b.id === batchId ? { ...b, isAnalyzing: true } : b
    );
    applyFilters(); // Re-render to show loading status only for the targeted ID

    const targetItem = inventoryData.find(d => d.id === batchId);
    if (!targetItem) return;

    const storageDate = new Date(targetItem.storage || targetItem.harvest);
    const storageDays = Math.max(1, Math.floor((new Date() - storageDate) / (1000 * 60 * 60 * 24)));

    const payload = {
        batchId: targetItem.id,
        produce: targetItem.product,
        temperature: targetItem.temperature,
        humidity: targetItem.humidity,
        storage_days: storageDays
    };

    try {
        const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

        const data = await response.json();

        // FINISH: Atomic State Update (MAPPING PATTERN - Mandatory Requirement 4)
        inventoryData = inventoryData.map(b => {
            if (b.id === batchId) {
                return {
                    ...b,
                    aiResult: {
                        spoilage_risk: data.spoilage_risk,
                        remaining_days: data.remaining_days,
                        priority: data.priority,
                        recommended_action: data.recommended_action,
                        confidence: Math.round(data.confidence * 100)
                    },
                    risk: data.spoilage_risk === 'High' ? 85 : (data.spoilage_risk === 'Medium' ? 45 : 15),
                    human_explanation: `AI Analysis Complete: ${data.recommended_action}. Confidence level: ${Math.round(data.confidence * 100)}%.`,
                    isAnalyzing: false
                };
            }
            return b;
        });

    } catch (error) {
        console.error("Critical Backend Failure:", error);
        inventoryData = inventoryData.map(b =>
            b.id === batchId ? {
                ...b,
                aiResult: {
                    spoilage_risk: 'Error',
                    remaining_days: '?',
                    priority: 'P3',
                    recommended_action: `Error: ${error.message || "Connection Failed"}`,
                    confidence: 0
                },
                human_explanation: `Critical Error: ${error.message || "Could not reach backend server."}`,
                isAnalyzing: false
            } : b
        );
    } finally {
        applyFilters(); // Sync UI with newly mapped state
    }
};

// Map legacy handler
window.analyzeBatch = window.dispatchAI;

function updateSummaryCards() {
    const recContainer = document.getElementById('dispatchRecs');
    if (!recContainer) return;

    const highRisk = [...inventoryData].sort((a, b) => b.risk - a.risk).slice(0, 3);

    recContainer.innerHTML = '';
    highRisk.forEach(item => {
        const hasResult = item.aiResult !== null;
        const priorityClass = (hasResult && item.aiResult.priority) ? `pb-${item.aiResult.priority.toLowerCase()}` : 'pb-p3';
        const priorityLabel = (hasResult && item.aiResult.priority) || 'P?';
        const actionText = (hasResult && item.aiResult.recommended_action) || 'Click Dispatch AI to analyze';
        const confidence = (hasResult && item.aiResult.confidence) || 0;

        const card = document.createElement('div');
        card.className = 'simulator-box glass-panel premium-hover';
        card.setAttribute('data-key', item.id); // Mandatory Identifier
        card.style.margin = '0';
        card.style.background = 'white';
        const riskLevelForColor = (hasResult && item.aiResult.spoilage_risk) || 'Analysis Required';

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
                    <div style="font-weight:800; color:${hasResult ? getRiskColor(item.risk) : '#94a3b8'}; font-size:0.85rem;">${riskLevelForColor}</div>
                </div>
                <div>
                    <div style="font-size:0.6rem; color:var(--text-secondary); text-transform:uppercase;">Days Left</div>
                    <div style="font-weight:800; color:var(--text-primary); font-size:0.85rem;">${(hasResult && item.aiResult.remaining_days) || '--'} Days</div>
                </div>
            </div>

            <div style="margin-bottom:15px;">
                <div style="font-size:0.65rem; color:var(--text-secondary); font-weight:700; display:flex; justify-content:space-between;">
                    <span>AI ACTION:</span>
                    <span>${confidence}% CONFIDENCE</span>
                </div>
                <div style="color:var(--text-primary); font-weight:800; font-size:0.75rem; margin:5px 0;">${actionText}</div>
                <div class="confidence-container">
                    ${hasResult ? `<div class="confidence-fill" style="width: ${confidence}%"></div>` : ''}
                </div>
            </div>

            <button onclick="dispatchAI('${item.id}')" class="btn-premium" style="width:100%; border-radius:8px; padding:10px; justify-content:center; font-size:0.75rem;" ${item.isAnalyzing ? 'disabled' : ''}>
                <span class="btn-text">${item.isAnalyzing ? 'ANALYZING...' : 'DISPATCH AI'}</span>
                <div class="spinner" style="${item.isAnalyzing ? 'display:block; border-color:white transparent white transparent;' : ''}"></div>
            </button>
        `;
        recContainer.appendChild(card);
    });

    // Alert Banner Update - Selective Trigger
    const analyzedBatches = inventoryData.filter(d => d.aiResult !== null);
    if (analyzedBatches.length > 0) {
        const highestRiskItem = analyzedBatches.reduce((prev, current) => (prev.risk > current.risk) ? prev : current);
        if (highestRiskItem.risk > 60) {
            const alertSystem = document.getElementById('alertSystem');
            if (alertSystem) alertSystem.style.display = 'flex';
            const alertText = document.getElementById('alertText');
            if (alertText) {
                alertText.innerHTML = `<strong>Batch #${highestRiskItem.id} (${highestRiskItem.product})</strong> is at ${highestRiskItem.aiResult.spoilage_risk} risk. ${highestRiskItem.aiResult.recommended_action}`;
            }
        }
    } else {
        const alertSystem = document.getElementById('alertSystem');
        if (alertSystem) alertSystem.style.display = 'none';
    }
}

// Filters & Search logic
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

    if (sortField === 'risk-desc') filteredData.sort((a, b) => b.risk - a.risk);
    else if (sortField === 'expiry-asc') filteredData.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
    else if (sortField === 'qty-desc') filteredData.sort((a, b) => parseInt(b.qty) - parseInt(a.qty));
    else if (sortField === 'id-asc') filteredData.sort((a, b) => a.id.localeCompare(b.id));

    renderInventory();
}

// Detailed Batch Viewer
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

    const timeline = document.getElementById('storageTimeline');
    timeline.innerHTML = (item.history || []).map(h => `
        <div style="display:flex; gap:15px; margin-bottom:15px; position:relative; padding-left:20px;">
            <div style="position:absolute; left:0; top:5px; width:10px; height:10px; border-radius:50%; background:var(--primary);"></div>
            <div style="font-size:0.8rem;">
                <div style="font-weight:700;">${h.action}</div>
                <div style="color:var(--text-secondary); font-size:0.7rem;">${h.time} | by ${h.user}</div>
            </div>
        </div>
    `).join('');

    const hasResult = item.aiResult !== null;
    document.getElementById('detAIPredict').innerText = item.human_explanation || (hasResult ? `AI Prediction: ${item.aiResult.recommended_action}` : "Dispatch AI Analysis required for prediction.");

    document.getElementById('aiInsightPanel').style.display = 'none';
    document.getElementById('insightChevron').className = 'fas fa-chevron-down';
    document.getElementById('detHumanExplanation').innerText = item.human_explanation || "Analyzing batch environmental stressors...";

    const reasonsList = document.getElementById('detRiskReasons');
    reasonsList.innerHTML = (item.reasons || []).map(r => `<li>${r}</li>`).join('');

    const revContainer = document.getElementById('revenueOptions');
    revContainer.innerHTML = (item.revenue || []).map(r => `
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

// Simulation Engine
window.runDispatchSimulator = async () => {
    const id = document.getElementById('detBatchID').innerText.replace('#', '');
    const item = inventoryData.find(d => d.id === id);
    if (!item) return;

    const results = document.getElementById('simulatorResults');
    results.style.display = 'block';
    results.innerHTML = `<div style="text-align:center; padding:15px; color:var(--primary);"><i class="fas fa-microchip fa-spin"></i> Running Simulator...</div>`;

    try {
        const payload1 = {
            batchId: id,
            produce: item.product, temperature: item.temperature, humidity: item.humidity,
            storage_days: Math.max(1, Math.floor((new Date() - new Date(item.storage)) / (1000 * 60 * 60 * 24)))
        };
        const payload2 = { ...payload1, batchId: id, temperature: payload1.temperature + 2.5, storage_days: payload1.storage_days + 3 };

        const [r1, r2] = await Promise.all([
            fetch('http://localhost:8000/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload1) }),
            fetch('http://localhost:8000/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload2) })
        ]);

        const d1 = await r1.json();
        const d2 = await r2.json();

        // Dynamic Revenue based on Qty and Risk
        const qtyVal = parseInt(item.qty);
        const baseRev = qtyVal * (item.product === 'Tomato' ? 100 : (item.product === 'Grapes' ? 300 : 80));
        const rev1 = baseRev * (1 - (item.risk / 500));
        const rev2 = baseRev * (1 - (d2.remaining_days < 3 ? 0.6 : 0.2));

        results.innerHTML = `
            <div class="simulator-box" style="border-color:var(--primary); background:white;">
                <div style="font-size:0.75rem; font-weight:800; color:var(--primary); margin-bottom:5px;">SCENARIO A: DISPATCH NOW</div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:0.8rem;">Risk: ${d1.spoilage_risk}</span>
                    <span style="font-weight:800; color:var(--primary);">₹${Math.round(rev1).toLocaleString()}</span>
                </div>
                <div style="font-size:0.65rem; color:var(--text-secondary); margin-top:5px;">Confidence: ${d1.confidence * 100}%</div>
            </div>
            <div class="simulator-box" style="border-color:var(--danger); margin-top:10px; background:white;">
                <div style="font-size:0.75rem; font-weight:800; color:var(--danger); margin-bottom:5px;">SCENARIO B: DELAY 5 DAYS</div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:0.8rem;">Risk: ${d2.spoilage_risk}</span>
                    <span style="font-weight:800; color:var(--danger);">₹${Math.round(rev2).toLocaleString()}</span>
                </div>
                <div style="font-size:0.65rem; color:var(--text-secondary); margin-top:5px;">Projected Loss: ₹${Math.round(rev1 - rev2).toLocaleString()}</div>
            </div>
        `;
    } catch (e) {
        results.innerHTML = `<div style="color:var(--danger); font-size:0.8rem; padding:10px;">Simulation Error: Backend unreachable.</div>`;
    }
};

function startSensorStream() {
    setInterval(() => {
        const tempEl = document.getElementById('liveTemp');
        const humEl = document.getElementById('liveHum');
        if (tempEl) tempEl.innerHTML = `${(14 + Math.random()).toFixed(1)}°C <i class="fas fa-caret-up"></i>`;
        if (humEl) humEl.innerHTML = `${(63 + Math.random()).toFixed(1)}% <i class="fas fa-caret-down"></i>`;
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    startSensorStream();
    document.getElementById('searchInput').oninput = applyFilters;
    document.getElementById('riskFilter').onchange = applyFilters;
    document.getElementById('zoneFilter').onchange = applyFilters;
    document.getElementById('typeFilter').onchange = applyFilters;
    document.getElementById('sortOption').onchange = applyFilters;

    const batchForm = document.getElementById('batchForm');
    if (batchForm) {
        batchForm.onsubmit = (e) => {
            e.preventDefault();
            const newId = 'AF-' + Math.floor(100 + Math.random() * 900);
            const produce = document.getElementById('formProduce').value;
            const newItem = {
                id: newId, product: produce, zone: document.getElementById('formZone').value,
                qty: document.getElementById('formQty').value + ' Kg',
                harvest: document.getElementById('formHarvestDate').value,
                storage: new Date().toISOString().split('T')[0], expiry: '2026-03-25',
                risk: 10, status: 'In Storage', farmer: 'Local Supplier', health: 99,
                temperature: 15.0, humidity: 65.0, isAnalyzing: false,
                aiResult: null,
                history: [{ time: 'Today', action: 'Entry', user: 'Admin' }],
                reasons: ['Newly stored'],
                revenue: [{ market: 'Standard', profit: '0%', value: '₹0' }]
            };
            inventoryData = [newItem, ...inventoryData]; // Immutability pattern
            applyFilters();
            closeModal('addBatchModal');
            dispatchAI(newId);
        };
    }
});

function confirmDispatch(id) {
    const item = inventoryData.find(d => d.id === id);
    if (!item) return;

    if (confirm(`Are you sure you want to execute dispatch for Batch #${id}?`)) {
        inventoryData = inventoryData.map(b =>
            b.id === id ? { ...b, status: 'Dispatched', risk: 0 } : b
        );
        applyFilters();
        alert(`Successfully dispatched ${item.product} (Batch #${id}). System tracking active.`);
        if (document.getElementById('detailModal')) closeModal('detailModal');
    }
}

window.confirmDispatch = confirmDispatch;

function getRiskColor(risk) { return risk > 70 ? '#D32F2F' : (risk > 30 ? '#F9A825' : '#2E7D32'); }
function getProductColor(p) {
    const colorMap = {
        'Tomato': '#e11d48', // Red
        'Onion': '#a855f7',  // Purple
        'Potato': '#92400e', // Brown
        'Grapes': '#10b981', // Green
        'Apples': '#ef4444'  // Red
    };
    return colorMap[p] || 'var(--primary)';
}

function getProductIcon(p) {
    const iconMap = {
        'Tomato': 'fa-apple-whole',
        'Onion': 'fa-lemon',
        'Potato': 'fa-egg',
        'Grapes': 'fa-leaf',
        'Apples': 'fa-apple-whole'
    };
    return iconMap[p] || 'fa-box';
}
function formatDate(d) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
window.showQR = (id) => {
    document.getElementById('qrTitle').innerText = `Batch #${id}`;
    document.getElementById('qrContainer').innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}" style="width:100%;">`;
    document.getElementById('qrModal').style.display = 'flex';
};
window.closeModal = (id) => { document.getElementById(id).style.display = 'none'; };
window.openAddModal = () => { document.getElementById('addBatchModal').style.display = 'flex'; };
