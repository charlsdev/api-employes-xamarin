const { Client } = require('pg');

const client = new Client({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   database: process.env.DB_NAME,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
});

client
   .connect()
   .then(() => console.log(`Conectado a ${process.env.DB_NAME}`))
   .catch((err) => console.error(`Error de conexión: ${err.stack}`));

module.exports = {
   client
};
