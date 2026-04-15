const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db/db_pf');

const app = express();

app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const session = require('express-session');

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true
    }
}));

function verificarSesion(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    next();
}

//MECANICOS MANEJO_PETICIONES
app.get('/mecanicos', verificarSesion, (req, res) => { 
    db.query('SELECT * FROM mecanicos', (err, results) => { 
        if (err) return res.status(500).send(err);

        res.json(results); 
    }); 
});

app.post('/mecanicos', verificarSesion, (req, res) => { 
    const { nombre, direccion, telefono, fecha_ingreso } = req.body;

    const sql = 'INSERT INTO mecanicos (nombre, direccion, telefono, fecha_ingreso) VALUES (?, ?, ?, ?)';

    db.query(sql, [nombre, direccion, telefono, fecha_ingreso], (err, result) => { 
        if (err) return res.status(500).send(err);

        res.send('Mecánico agregado correctamente'); 
    }); 
});

app.put('/mecanicos/:id', verificarSesion, (req, res) => { 
    const { nombre, direccion, telefono, fecha_ingreso } = req.body; 
    const { id } = req.params;

    db.query(
        'UPDATE mecanicos SET nombre = ?, direccion = ?, telefono = ?, fecha_ingreso = ? WHERE id = ?', 
        [nombre, direccion, telefono, fecha_ingreso, id], 
        (err) => { 
            if (err) return res.status(500).send(err);

            res.send('Datos del mecánico actualizados correctamente'); 
        } 
    ); 
});

app.delete('/mecanicos/:id', verificarSesion, (req, res) => { 
    const { id } = req.params;

    db.query('DELETE FROM mecanicos WHERE id = ?', [id], (err) => { 
        if (err) return res.status(500).send(err); 
        res.send('Mecánico eliminado correctamente'); 
    }); 
});


//CLIENTES MANEJO_PETICIONES
app.get('/clientes', verificarSesion, (req, res) => { 
    db.query('SELECT * FROM clientes', (err, results) => { 
        if (err) return res.status(500).send(err);

        res.json(results); 
    }); 
});

app.post('/clientes', verificarSesion, (req, res) => { 
    const { nombre, telefono, auto, descripcion_problema } = req.body;

    const sql = 'INSERT INTO clientes (nombre, telefono, auto, descripcion_problema) VALUES (?, ?, ?, ?)';

    db.query(sql, [nombre, telefono, auto, descripcion_problema], (err, result) => { 
        if (err) return res.status(500).send(err);

        res.send('Cliente agregado correctamente'); 
    }); 
});

app.put('/clientes/:id', verificarSesion, (req, res) => { 
    const { nombre, telefono, auto, descripcion_problema } = req.body; 
    const { id } = req.params;

    db.query(
        'UPDATE clientes SET nombre = ?, telefono = ?, auto = ?, descripcion_problema = ? WHERE id = ?', 
        [nombre, telefono, auto, descripcion_problema, id], 
        (err) => { 
            if (err) return res.status(500).send(err);

            res.send('Datos del cliente actualizados correctamente'); 
        } 
    ); 
});

app.delete('/clientes/:id', verificarSesion, (req, res) => { 
    const { id } = req.params;

    db.query('DELETE FROM clientes WHERE id = ?', [id], (err) => { 
        if (err) return res.status(500).send(err); 
        res.send('Cliente eliminado correctamente'); 
    }); 
});


//USUARIOS MANEJO_SESIONES
app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)';

        db.query(sql, [nombre, correo, hashedPassword], (err) => {
            if (err) return res.status(500).send(err);

            res.send('Usuario creado correctamente');
        });

    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/login', (req, res) => {
    const { correo, password } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE correo = ?';

    db.query(sql, [correo], async (err, results) => {
        if (results.length === 0) {
            return res.redirect('http://localhost:5500/APLICACIONES_WEB/proyecto_final/frontend/login.html?error=1');
        }

        const usuario = results[0];

        const match = await bcrypt.compare(password, usuario.password);

        if (match) {
            req.session.usuario = {
                id: usuario.id,
                nombre: usuario.nombre,
            };

            res.redirect('http://localhost:5500/APLICACIONES_WEB/proyecto_final/frontend/inicio.html');
        } else {
            res.redirect('http://localhost:5500/APLICACIONES_WEB/proyecto_final/frontend/login.html?error=1');
        }
    });
});

app.get('/perfil', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).send('Usuario no autorizado');
    }

    res.json(req.session.usuario);
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }

        res.clearCookie('connect.sid');
        return res.json({ ok: true });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});