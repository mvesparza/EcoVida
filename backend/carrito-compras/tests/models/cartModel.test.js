require('dotenv').config();
const { pool } = require('../../config/db');
const { createCart, getCartByUserId, addProductToCart, updateProductQuantity, removeProductFromCart, emptyCart } = require('../../src/models/cartModel');

jest.mock('../../config/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Cart Model Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe crear un carrito', async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1, usuario_id: 10 }] });

        const cart = await createCart(10);

        expect(cart).toHaveProperty('id', 1);
        expect(cart).toHaveProperty('usuario_id', 10);
    });

    test('Debe obtener el carrito de un usuario', async () => {
        pool.query.mockResolvedValue({
            rows: [{ carrito_id: 1, producto_id: 2, cantidad: 3 }],
        });

        const cart = await getCartByUserId(10);

        expect(cart).toEqual([{ carrito_id: 1, producto_id: 2, cantidad: 3 }]);
    });

    test('Debe agregar un producto al carrito', async () => {
        pool.query.mockResolvedValue({
            rows: [{ carrito_id: 1, producto_id: 2, cantidad: 5 }],
        });

        const product = await addProductToCart(1, 2, 5);

        expect(product).toHaveProperty('carrito_id', 1);
        expect(product).toHaveProperty('producto_id', 2);
        expect(product).toHaveProperty('cantidad', 5);
    });

    test('Debe actualizar la cantidad de un producto en el carrito', async () => {
        pool.query.mockResolvedValue({
            rows: [{ carrito_id: 1, producto_id: 2, cantidad: 10 }],
        });

        const updatedProduct = await updateProductQuantity(1, 2, 10);

        expect(updatedProduct).toHaveProperty('cantidad', 10);
    });

    test('Debe eliminar un producto del carrito', async () => {
        pool.query.mockResolvedValue({
            rows: [{ carrito_id: 1, producto_id: 2 }],
        });

        const removedProduct = await removeProductFromCart(1, 2);

        expect(removedProduct).toHaveProperty('carrito_id', 1);
        expect(removedProduct).toHaveProperty('producto_id', 2);
    });

    test('Debe vaciar el carrito de un usuario', async () => {
        pool.query.mockResolvedValue({});

        await emptyCart(10);

        expect(pool.query).toHaveBeenCalledTimes(2); // Se ejecutan dos consultas SQL
    });
});
