require('dotenv').config();
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cartRoutes = require('../../src/routes/cartRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', cartRoutes);

jest.mock('../../src/models/cartModel', () => ({
    createCart: jest.fn(),
    getCartByUserId: jest.fn(),
    addProductToCart: jest.fn(),
    updateProductQuantity: jest.fn(),
    removeProductFromCart: jest.fn(),
    emptyCart: jest.fn(),
}));

const { createCart, getCartByUserId, addProductToCart, updateProductQuantity, removeProductFromCart, emptyCart } = require('../../src/models/cartModel');

describe('Cart Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe obtener el carrito de un usuario', async () => {
        getCartByUserId.mockResolvedValue([{ carrito_id: 1, producto_id: 2, cantidad: 1 }]);

        const response = await request(app).get('/api/carrito').set('Authorization', 'Bearer fakeToken');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ carrito_id: 1, producto_id: 2, cantidad: 1 }]);
    });

    test('Debe devolver error si no se puede obtener el carrito', async () => {
        getCartByUserId.mockRejectedValue(new Error('Error en la BD'));

        const response = await request(app).get('/api/carrito').set('Authorization', 'Bearer fakeToken');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Error al obtener el carrito');
    });
});

jest.mock('../../src/middlewares/authorize', () => (roles) => (req, res, next) => {
    req.user = { id: 1, rol: 'cliente' }; // Simulamos un usuario autenticado
    next();
});
