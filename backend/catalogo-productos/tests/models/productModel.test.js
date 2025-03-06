require('dotenv').config();
const { pool } = require('../../config/db');
const { getAllProducts, getProductById, createProduct } = require('../../src/models/productModel');

jest.mock('../../config/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Product Model Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe obtener todos los productos', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1, nombre: 'Laptop' }] });

        const products = await getAllProducts();

        expect(products).toEqual([{ id: 1, nombre: 'Laptop' }]);
    });

    test('Debe obtener un producto por ID', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1, nombre: 'Laptop' }] });

        const product = await getProductById(1);

        expect(product).toHaveProperty('id', 1);
    });
});
