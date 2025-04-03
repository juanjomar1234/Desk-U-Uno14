document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    
    // Formulario de login
    root.innerHTML = `
        <div class="login-container">
            <h2>Acceso Colaboradores</h2>
            <form id="loginForm">
                <input type="email" id="email" placeholder="Email" required>
                <input type="password" id="password" placeholder="Contraseña" required>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    `;

    // Manejar el login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard';
            } else {
                alert('Error en el login');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en el servidor');
        }
    });
}); 