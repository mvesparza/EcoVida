require('dotenv').config();
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const pedidoRoutes = require('../../src/routes/pedidoRoutes');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use('/api', pedidoRoutes);

// Mock del middleware de autorización
jest.mock('../../src/middlewares/authorize', () => (roles) => (req, res, next) => {
    req.user = { id: 1, rol: 'cliente' }; // Simulamos un usuario autenticado
    next();
});

// Mock de axios para evitar llamadas reales a microservicios
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

// Mock del modelo de pedidos
jest.mock('../../src/models/pedidoModel', () => ({
    createPedido: jest.fn(),
    addProductosToPedido: jest.fn(),
    updatePedidoTotal: jest.fn(),
    updatePedidoEstado: jest.fn(),
    getProductosByPedidoId: jest.fn(),
    getPedidoById: jest.fn(),
    getPedidosByUsuarioId: jest.fn(),
}));

// Importamos los mocks correctamente
const { createPedido, addProductosToPedido, updatePedidoTotal, getPedidosByUsuarioId } = require('../../src/models/pedidoModel');

describe('Pedido Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe registrar un pedido', async () => {
        // 📌 Simular que el carrito tiene productos
        axios.get.mockImplementation((url) => {
            if (url.includes('carrito')) {
                return Promise.resolve({ data: [{ producto_id: 1, cantidad: 2 }] });
            }
            if (url.includes('productos')) {
                return Promise.resolve({ data: { id: 1, precio: 50, stock: 10 } });
            }
        });

        // 📌 Simulamos la creación del pedido
        createPedido.mockResolvedValue({ id: 1, usuario_id: 10, estado: 'pendiente', total: 0 });

        // 📌 Simular que los productos se agregan correctamente al pedido
        addProductosToPedido.mockResolvedValue([
            { producto_id: 1, cantidad: 2, subtotal: 100 }
        ]);

        // 📌 Simular que el pedido se actualiza correctamente con el total
        updatePedidoTotal.mockResolvedValue({
            id: 1, usuario_id: 10, estado: 'pendiente', total: 100
        });

        // 📌 Simular la eliminación del carrito después del pedido
        axios.delete.mockResolvedValue({});

        const response = await request(app)
            .post('/api/pedidos')
            .set('Authorization', 'Bearer fakeToken');

        console.log('Respuesta del servidor:', response.body); // 👉 Depuración

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('pedido');
        expect(response.body.pedido.total).toBe(100);
    });

    test('Debe obtener el historial de pedidos de un usuario', async () => {
        getPedidosByUsuarioId.mockResolvedValue([
            { id: 1, estado: 'pendiente', fecha_creacion: '2025-03-05T12:00:00.000Z', total: 100 },
        ]);

        const response = await request(app).get('/api/pedidos/historial').set('Authorization', 'Bearer fakeToken');

        expect(response.status).toBe(200);
        expect(response.body.pedidos.length).toBeGreaterThan(0);
    });
});
