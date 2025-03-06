require('dotenv').config();
const jwt = require('jsonwebtoken');
const authorize = require('../../src/middlewares/authorize');

jest.mock('jsonwebtoken');

describe('Middleware de autorización', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: { authorization: 'Bearer fakeToken' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('Debe permitir el acceso si el usuario tiene el rol adecuado', () => {
        jwt.verify.mockReturnValue({ id: 1, email: 'test@email.com', rol: 'administrador' });

        const middleware = authorize(['administrador']);
        middleware(req, res, next);

        expect(req.user).toHaveProperty('rol', 'administrador');
        expect(next).toHaveBeenCalled();
    });

    test('Debe rechazar el acceso si el usuario no tiene los permisos', () => {
        jwt.verify.mockReturnValue({ id: 2, email: 'test@email.com', rol: 'cliente' });

        const middleware = authorize(['administrador']);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'No tienes permisos para realizar esta acción.' });
    });

    test('Debe rechazar el acceso si no hay token', () => {
        req.headers.authorization = '';

        const middleware = authorize(['administrador']);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acceso no autorizado. Token no proporcionado.' });
    });
});
