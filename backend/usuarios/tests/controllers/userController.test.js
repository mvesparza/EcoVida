require('dotenv').config();
console.log('JWT_SECRET en test:', process.env.JWT_SECRET);

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../../src/routes/userRoutes'); // Ruta corregida
const { pool } = require('../../config/db'); // Ruta corregida
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use('/api/usuarios', userRoutes);

jest.mock('../../src/models/userModel', () => ({
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    getRoleIdByName: jest.fn(),
    getUserById: jest.fn(),
}));

jest.mock('../../src/services/emailService', () => ({
    sendConfirmationEmail: jest.fn(),
}));

const { getUserByEmail, createUser, getRoleIdByName } = require('../../src/models/userModel');
const { sendConfirmationEmail } = require('../../src/services/emailService');

describe('User Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Registro de usuario exitoso', async () => {
        getUserByEmail.mockResolvedValue(null);
        getRoleIdByName.mockResolvedValue(1);
        createUser.mockResolvedValue({ id: 1, nombre: 'Test', email: 'test@email.com', rol: 'cliente' });
        sendConfirmationEmail.mockResolvedValue(true);

        const response = await request(app).post('/api/usuarios/register').send({
            nombre: 'Test',
            email: 'test@email.com',
            password: 'Test123!',
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Usuario registrado. Verifica tu correo electrónico.');
    });

    test('Login exitoso', async () => {
        const hashedPassword = await require('bcrypt').hash('Test123!', 10);
        getUserByEmail.mockResolvedValue({
            id: 1,
            email: 'test@email.com',
            password: hashedPassword,
            rol_nombre: 'cliente',
        });

        const response = await request(app).post('/api/usuarios/login').send({
            email: 'test@email.com',
            password: 'Test123!',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('Error en login con credenciales incorrectas', async () => {
        getUserByEmail.mockResolvedValue(null);

        const response = await request(app).post('/api/usuarios/login').send({
            email: 'test@email.com',
            password: 'WrongPassword',
        });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Credenciales incorrectas');
    });
});
