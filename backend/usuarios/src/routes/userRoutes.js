const express = require('express');
const { registerUser, loginUser, verifyUser, getUserProfile, getUserById} = require('../controllers/userController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Middleware para validar el token JWT
const { getAllUsers } = require('../controllers/userController');
const { deleteUser } = require('../controllers/userController');

// Ruta para eliminar usuario por ID (Solo administradores)
router.delete('/:id', authenticate, deleteUser);



// Ruta para obtener todos los usuarios (solo administradores)
router.get('/', authenticate, async (req, res) => {
    if (req.user.rol !== "administrador") {
        return res.status(403).json({ error: "Acceso denegado" });
    }
    getAllUsers(req, res);
});



// Endpoint para registrar usuarios
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para verificar el correo
router.get('/verify', verifyUser);

// Ruta para consultar el perfil
router.get('/perfil', authenticate, getUserProfile);

// Ruta para obtener un usuario por ID
router.get('/:id', getUserById);

module.exports = router;
