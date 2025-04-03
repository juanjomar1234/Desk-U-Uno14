const createService = require('../base-service');
const app = createService('user', 3001);

// Middleware para procesar JSON
app.use(express.json());

// Base de datos en memoria
const users = [];

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'user-service' });
});

// Endpoint de registro
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Validación básica
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Crear usuario
    const user = {
        id: Date.now().toString(),
        username,
        email,
        password
    };
    
    users.push(user);
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: user.id });
});

// Endpoint de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const token = 'test-token-' + user.id;
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});
