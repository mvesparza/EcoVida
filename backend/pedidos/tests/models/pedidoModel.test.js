require('dotenv').config();
const { pool } = require('../../config/db');
const { createPedido, getPedidoById, updatePedidoEstado, getPedidosByUsuarioId } = require('../../src/models/pedidoModel');

jest.mock('../../config/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Pedido Model Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe crear un pedido', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1, usuario_id: 10, estado: 'pendiente', total: 0 }] });

        const pedido = await createPedido(10);

        expect(pedido).toHaveProperty('id', 1);
        expect(pedido).toHaveProperty('usuario_id', 10);
    });

    test('Debe obtener un pedido por ID', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1, usuario_id: 10, estado: 'pendiente', total: 100 }] });

        const pedido = await getPedidoById(1);

        expect(pedido).toHaveProperty('id', 1);
        expect(pedido).toHaveProperty('estado', 'pendiente');
    });

    test('Debe actualizar el estado de un pedido', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1, estado: 'confirmado' }] });

        const pedidoActualizado = await updatePedidoEstado(1, 'confirmado');

        expect(pedidoActualizado).toHaveProperty('estado', 'confirmado');
    });

    test('Debe obtener todos los pedidos de un usuario', async () => {
        pool.query.mockResolvedValue({
            rows: [{ id: 1, estado: 'pendiente', fecha_creacion: '2025-03-05T12:00:00.000Z', total: 100 }],
        });

        const pedidos = await getPedidosByUsuarioId(10);

        expect(pedidos.length).toBeGreaterThan(0);
        expect(pedidos[0]).toHaveProperty('estado', 'pendiente');
    });
});
