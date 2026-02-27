/**
 * AgriFresh AI Command Center Module
 * Professional Decision Support System
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
            card.className = 'decision-card glass-panel';
            if (rec.priority === 'P1') card.classList.add('urgent-glow');
            card.style.borderLeftColor = rec.priority === 'P1' ? 'var(--danger)' : 'var(--accent)';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start">
                    <div>
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                            <span class="badge" style="background:${rec.priority === 'P1' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'}; color:${rec.priority === 'P1' ? '#ef4444' : '#f59e0b'}">
                                ${rec.priority === 'P1' ? 'URGENT ACTION' : 'ADVISORY'}
                            </span>
                            <span style="font-size:0.7rem; color:var(--text-secondary);">ZONE ${rec.zoneId}</span>
                        </div>
                        <h4 style="margin-bottom:8px; font-weight:700; font-size:1.1rem;">${rec.action}: ${rec.target}</h4>
                        <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${rec.reason}</p>
                    </div>
                    <div style="text-align:right">
                        <div style="font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase;">AI Confidence</div>
                        <div style="font-size:1.2rem; font-weight:800; color:var(--secondary);">${rec.confidence}%</div>
                    </div>
                </div>

                <div style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.02); border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-size:0.7rem; color:var(--text-secondary);">PREDICTED SAVINGS</div>
                        <div style="font-weight:700; color:var(--primary);">₹${rec.predictedLoss.toLocaleString()}</div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="glass-panel delay-btn" data-id="${rec.id}" style="padding:8px 15px; font-size:0.8rem; cursor:pointer;">Delay</button>
                        <button class="btn-premium approve-btn" data-id="${rec.id}" style="padding:8px 20px; font-size:0.8rem;">Approve</button>
                    </div>
                </div>
            `;

            // Add Event Listeners
            card.querySelector('.approve-btn').addEventListener('click', () => {
                this.handleApproval(rec.id);
            });

            container.appendChild(card);
        });

        if (container.innerHTML === '') {
            container.innerHTML = `
                <div style="text-align:center; padding:40px; color:var(--text-secondary);">
                    <i class="fas fa-check-circle" style="font-size:2rem; color:var(--primary); margin-bottom:15px; display:block;"></i>
                    All recommendations addressed. AI is monitoring for new anomalies.
                </div>
            `;
        }
    },

    handleApproval(id) {
        if (AppState.approveRecommendation(id)) {
            // Visual feedback
            const container = document.getElementById('aiDecisionCenter');
            container.style.opacity = '0.5';

            setTimeout(() => {
                this.renderDecisionCards('aiDecisionCenter');
                container.style.opacity = '1';

                // Show success notification
                this.showNotification("AI Action Logged", "Inventory tracking and warehouse utilization updated successfully.");
            }, 600);
        }
    },

    showNotification(title, msg, type = 'success') {
        const notif = document.createElement('div');
        notif.className = 'glass-panel';
        notif.style.position = 'fixed';
        notif.style.bottom = '40px';
        notif.style.right = '40px';
        notif.style.padding = '24px';
        notif.style.width = '350px';

        const colors = {
            success: 'var(--primary)',
            warning: '#f59e0b',
            critical: '#ef4444'
        };

        notif.style.borderLeft = `5px solid ${colors[type]}`;
        notif.style.zIndex = '100000';
        notif.style.animation = 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        notif.style.boxShadow = `0 10px 40px rgba(0,0,0,0.4), 0 0 20px ${colors[type]}20`;

        notif.innerHTML = `
            <div style="display:flex; gap:15px; align-items:flex-start;">
                <div style="width:40px; height:40px; border-radius:50%; background:${colors[type]}15; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <i class="fas ${type === 'critical' ? 'fa-exclamation-triangle' : 'fa-info-circle'}" style="color:${colors[type]}"></i>
                </div>
                <div>
                    <h4 style="color:${colors[type]}; margin-bottom:5px; font-weight:800; font-size:1rem;">${title}</h4>
                    <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${msg}</p>
                </div>
            </div>
        `;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transform = 'translateY(20px)';
            notif.style.transition = 'all 0.4s ease';
            setTimeout(() => notif.remove(), 4000);
        }, 4000);
    }
};
