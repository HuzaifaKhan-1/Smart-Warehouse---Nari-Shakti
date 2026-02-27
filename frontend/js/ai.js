// AgriFresh AI Intelligence Agent

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    const chatWindow = document.getElementById('chatWindow');

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim() !== "") {
                const userMsg = chatInput.value.trim();
                appendMessage('user', userMsg);
                chatInput.value = "";

                // Simulate Agent Processing
                setTimeout(() => {
                    handleAgentQuery(userMsg);
                }, 600);
            }
        });
    }
});

function appendMessage(role, text) {
    const chatWindow = document.getElementById('chatWindow');
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = "15px";
    msgDiv.style.fontSize = "0.9rem";
    msgDiv.style.padding = "10px";
    msgDiv.style.borderRadius = "12px";

    if (role === 'user') {
        msgDiv.style.background = "rgba(59, 130, 246, 0.2)";
        msgDiv.style.marginLeft = "20px";
        msgDiv.innerText = text;
    } else {
        msgDiv.style.background = "rgba(255, 255, 255, 0.05)";
        msgDiv.style.marginRight = "20px";
        msgDiv.innerHTML = `<i class="fas fa-robot" style="margin-right: 8px; color: var(--primary);"></i> ${text}`;
    }

    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function handleAgentQuery(query) {
    const q = query.toLowerCase();
    let response = "";

    if (q.includes("risk") || q.includes("highest risk")) {
        response = "Batch #AF-290 (Tomato) is currently at the highest risk (88%) due to a temperature spike in Zone C-4.";
    } else if (q.includes("dispatch")) {
        response = "I recommend dispatching Lot 23 immediately. Market prices for Tomatoes in the nearby Mandi are currently peaking at ₹45/kg, making this an optimal exit window.";
    } else if (q.includes("cooling") || q.includes("zone")) {
        response = "Zone C-4 needs a -3°C adjustment. I have sent a request to the climate control system.";
    } else {
        response = "I'm analyzing the real-time sensor streams. Currently, 94% of the warehouse is within optimal parameters. Is there a specific batch you'd like me to check?";
    }

    appendMessage('agent', response);
}
