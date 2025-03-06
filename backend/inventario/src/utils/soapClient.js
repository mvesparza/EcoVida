const soap = require('soap');

const createSoapClient = async (wsdlUrl) => {
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlUrl, (err, client) => {
      if (err) {
        return reject(new Error(`Error al crear el cliente SOAP: ${err.message}`));
      }
      resolve(client);
    });
  });
};

module.exports = { createSoapClient };
