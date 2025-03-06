require('dotenv').config();
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const categoryRoutes = require('../../src/routes/categoryRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', categoryRoutes);

jest.mock('../../src/models/categoryModel', () => ({
    getAllCategories: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
}));

const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../../src/models/categoryModel');

describe('Category Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe obtener todas las categorías', async () => {
        getAllCategories.mockResolvedValue([{ id: 1, nombre: 'Electrónica' }]);

        const response = await request(app).get('/api/categorias');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, nombre: 'Electrónica' }]);
    });

    test('Debe devolver error si no hay categorías', async () => {
        getAllCategories.mockRejectedValue(new Error('Error en la BD'));

        const response = await request(app).get('/api/categorias');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Error al obtener las categorías');
    });
});
