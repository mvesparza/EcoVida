const { pool } = require('../../config/db'); // Ruta corregida
const { createUser, getUserByEmail, getRoleIdByName, getUserById } = require('../../src/models/userModel'); // Ruta corregida

jest.mock('../../config/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('User Model Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe crear un usuario en la base de datos', async () => {
        pool.query.mockResolvedValue({
            rows: [{ id: 1, nombre: 'Test', email: 'test@email.com', rol_id: 1 }],
        });

        const user = await createUser('Test', 'test@email.com', 'hashedPassword', 1);

        expect(user).toHaveProperty('id', 1);
        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    test('Debe obtener un usuario por correo electrónico', async () => {
        pool.query.mockResolvedValue({
            rows: [{ id: 1, nombre: 'Test', email: 'test@email.com', rol_nombre: 'cliente' }],
        });

        const user = await getUserByEmail('test@email.com');

        expect(user).toHaveProperty('id', 1);
        expect(user.email).toBe('test@email.com');
    });

    test('Debe obtener un ID de rol por nombre', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 2 }] });

        const roleId = await getRoleIdByName('administrador');

        expect(roleId).toBe(2);
    });

    test('Debe obtener un usuario por ID', async () => {
        pool.query.mockResolvedValue({
            rows: [{ id: 1, nombre: 'Test', email: 'test@email.com', rol: 'cliente' }],
        });

        const user = await getUserById(1);

        expect(user.id).toBe(1);
    });
});
