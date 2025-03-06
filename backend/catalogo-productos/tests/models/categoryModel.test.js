require('dotenv').config();
const { pool } = require('../../config/db');
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../../src/models/categoryModel');

jest.mock('../../config/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Category Model Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe obtener todas las categorías', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1, nombre: 'Electrónica' }] });

        const categories = await getAllCategories();

        expect(categories).toEqual([{ id: 1, nombre: 'Electrónica' }]);
    });

    test('Debe obtener una categoría por ID', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1, nombre: 'Electrónica' }] });

        const category = await getCategoryById(1);

        expect(category).toHaveProperty('id', 1);
    });
});
