// AgriFresh Authentication Logic (Mock for Demo)

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const role = loginForm.querySelector('select').value;

            // Simple demo validation
            if (email && password) {
                console.log(`Logging in as ${role}...`);

                // Store session info (mock)
                localStorage.setItem('agrifresh_user', JSON.stringify({
                    email: email,
                    role: role,
                    timestamp: new Date().toISOString()
                }));

                // Visual feedback
                const btn = loginForm.querySelector('button');
                btn.innerText = "Authenticating...";
                btn.style.opacity = "0.7";

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        });
    }
});
