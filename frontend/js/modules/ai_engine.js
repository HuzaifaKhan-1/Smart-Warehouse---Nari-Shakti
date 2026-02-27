/**
 * AgriFresh AI Command Center Module
 * Operational Support (Light Theme)
 */
import { AppState } from './state.js';

export const AIEngine = {
    accuracies: {
        spoilage: 96,
        optimization: 92
    },

    init() {
        this.renderDecisionCards('aiDecisionCenter');
    },

    renderDecisionCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        AppState.recommendations.forEach(rec => {
            if (rec.status !== 'pending') return;

            const card = document.createElement('div');
            card.className = 'decision-card';
            if (rec.priority === 'P1') card.classList.add('urgent-glow');

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start">
                    <div>
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <span class="badge" style="background:${rec.priority === 'P1' ? 'var(--danger-bg)' : 'var(--warning-bg)'}; color:${rec.priority === 'P1' ? 'var(--danger)' : 'var(--warning)'}">
                                ${rec.priority === 'P1' ? 'Immediate Action Needed' : 'Optimization Advice'}
                            </span>
                            <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:700;">LOCATION: ZONE ${rec.zoneId}</span>
                        </div>
                        <h4 style="margin-bottom:8px; font-weight:700; color:var(--text-primary); font-size:1.1rem;">${rec.action} for ${rec.target}</h4>
                        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5;">${this.simplifyReason(rec.reason)}</p>
                    </div>
                    <div style="text-align:right">
                        <div style="font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Model Confidence</div>
                        <div style="font-size:1.4rem; font-weight:900; color:var(--primary);">${rec.confidence}%</div>
                    </div>
                </div>

                <div style="margin-top:20px; padding:15px; background:var(--bg-light); border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Estimated Savings</div>
                        <div style="font-weight:800; color:var(--primary); font-size:1.1rem;">₹${rec.predictedLoss.toLocaleString()}</div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="ignore-btn" data-id="${rec.id}" style="padding:10px 18px; font-size:0.85rem; border:1px solid var(--card-border); background:white; border-radius:10px; cursor:pointer; font-weight:600; color:var(--text-secondary);">Ignore</button>
                        <button class="btn-premium approve-btn" data-id="${rec.id}" style="padding:10px 22px; font-size:0.85rem;">Approve & Execute</button>
                    </div>
                </div>
            `;

            card.querySelector('.approve-btn').addEventListener('click', () => {
                this.handleApproval(rec.id);
            });

            card.querySelector('.ignore-btn').addEventListener('click', (e) => {
                e.target.closest('.decision-card').style.opacity = '0.4';
                e.target.innerText = 'Ignored';
                e.target.disabled = true;
            });

            container.appendChild(card);
        });

        if (container.innerHTML === '') {
            container.innerHTML = `
                <div style="text-align:center; padding:50px 20px;">
                    <i class="fas fa-check-circle" style="font-size:2.5rem; color:var(--primary); margin-bottom:15px; display:block;"></i>
                    <h3 style="color:var(--text-primary); margin-bottom:10px;">System Health Optimal</h3>
                    <p style="color:var(--text-secondary); font-size:0.9rem;">AI is currently monitoring the warehouse. No actions required at this time.</p>
                </div>
            `;
        }
    },

    simplifyReason(reason) {
        if (reason.includes('% Spoilage Risk')) {
            const match = reason.match(/(\d+)%/);
            const percent = match ? match[1] : '80';
            return `Risk of produce getting spoiled is high (${percent}%). Market dispatch suggested to preserve quality.`;
        }
        if (reason.includes('Humidity anomaly')) {
            return `Air moisture levels are too high in this area. Reducing temperature will help keep produce fresh.`;
        }
        return reason;
    },

    handleApproval(id) {
        if (AppState.approveRecommendation(id)) {
            const container = document.getElementById('aiDecisionCenter');
            container.style.opacity = '0.5';

            setTimeout(() => {
                this.renderDecisionCards('aiDecisionCenter');
                container.style.opacity = '1';
                this.showNotification("Action Approved", "The warehouse inventory and metrics have been updated.", "success");
            }, 600);
        }
    },

    showNotification(title, msg, type = 'success') {
        const notif = document.createElement('div');
        notif.style.position = 'fixed';
        notif.style.bottom = '40px';
        notif.style.right = '40px';
        notif.style.background = 'white';
        notif.style.padding = '24px';
        notif.style.borderRadius = '20px';
        notif.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
        notif.style.borderLeft = `6px solid ${type === 'success' ? 'var(--primary)' : 'var(--danger)'}`;
        notif.style.zIndex = '100000';
        notif.style.minWidth = '350px';

        notif.innerHTML = `
            <div style="display:flex; gap:15px; align-items:center;">
                <div style="width:40px; height:40px; border-radius:50%; background:var(--bg-light); display:flex; align-items:center; justify-content:center;">
                    <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation'}" style="color:var(--primary)"></i>
                </div>
                <div>
                    <h4 style="color:var(--text-primary); margin-bottom:4px; font-weight:800;">${title}</h4>
                    <p style="font-size:0.85rem; color:var(--text-secondary);">${msg}</p>
                </div>
            </div>
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 4000);
    }
};
