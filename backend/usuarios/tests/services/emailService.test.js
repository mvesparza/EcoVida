require('dotenv').config();
console.log('EMAIL_USER en test:', process.env.EMAIL_USER);

const { sendConfirmationEmail } = require('../../src/services/emailService'); // Ruta corregida
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('Email Service', () => {
    let transporterMock;

    beforeEach(() => {
        transporterMock = {
            sendMail: jest.fn().mockResolvedValue(true),
        };
        nodemailer.createTransport.mockReturnValue(transporterMock);
    });

    test('Debe enviar un correo de verificación', async () => {
        await sendConfirmationEmail('test@email.com', 'Test', 'http://link.com', 'password123');

        expect(transporterMock.sendMail).toHaveBeenCalledTimes(1);
        expect(transporterMock.sendMail).toHaveBeenCalledWith({
            from: process.env.EMAIL_USER,
            to: 'test@email.com',
            subject: 'Verifica tu cuenta',
            text: expect.stringContaining('Gracias por registrarte en nuestra plataforma'), // En vez de "Verifica tu cuenta"
        });
        
    });

    test('Debe manejar errores al enviar correos', async () => {
        transporterMock.sendMail.mockRejectedValue(new Error('Error en el envío'));

        await expect(
            sendConfirmationEmail('test@email.com', 'Test', 'http://link.com', 'password123')
        ).rejects.toThrow('No se pudo enviar el correo de verificación');
    });
});
