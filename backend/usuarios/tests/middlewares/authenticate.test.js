const jwt = require('jsonwebtoken');
const authenticate = require('../../src/middlewares/authenticate'); // Ruta corregida

jest.mock('jsonwebtoken');

describe('Middleware de autenticación', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: { authorization: 'Bearer fakeToken' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    test('Debe autenticar con un token válido', () => {
        jwt.verify.mockReturnValue({ id: 1, email: 'test@email.com', rol: 'cliente' });

        authenticate(req, res, next);

        expect(req.user).toHaveProperty('id', 1);
        expect(next).toHaveBeenCalled();
    });

    test('Debe rechazar si no hay token', () => {
        req.headers.authorization = '';

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No autorizado. Token no proporcionado.' });
    });

    test('Debe rechazar si el token es inválido', () => {
        jwt.verify.mockImplementation(() => {
            throw new Error('Token inválido');
        });

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado.' });
    });
});
