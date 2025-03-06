require('dotenv').config();
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('../../src/routes/productRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', productRoutes);

jest.mock('../../src/models/productModel', () => ({
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
}));

const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../../src/models/productModel');

describe('Product Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe obtener todos los productos', async () => {
        getAllProducts.mockResolvedValue([{ id: 1, nombre: 'Laptop' }]);

        const response = await request(app).get('/api/productos');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, nombre: 'Laptop' }]);
    });

    test('Debe devolver error si no se pueden obtener productos', async () => {
        getAllProducts.mockRejectedValue(new Error('Error en la BD'));

        const response = await request(app).get('/api/productos');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Error al obtener los productos');
    });
});
