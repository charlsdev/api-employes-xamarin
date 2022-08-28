require('dotenv').config();
const { client } = require('./database');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
   res.status(200).json({
      msg: 'Welcome to API - Employes Xamarin'
   });
});

app.post('/api', async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      salario
   } = req.body;

   const strQuery = 'INSERT INTO employes(cedula, apellidos, nombres, salario) VALUES($1, $2, $3, $4) RETURNING *';
   const values = [`${cedula}`, `${apellidos}`, `${nombres}`, `${salario}`];

   try {
      const resp = await client.query(strQuery, values);
      
      if ((resp.rows).length > 0) {
         res.status(200).json({
            msg: 'Empleado agregado con éxito...'
         });
      } else {
         res.status(408).json({
            msg: 'Empleado no agregado...'
         });
      }
   } catch (err) {
      console.log(err.stack);

      res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.get('/api', async (req, res) => {
   const strQuery = 'SELECT cedula, CONCAT(apellidos, \' \', nombres) AS name_completo, salario FROM employes ORDER BY salario DESC';

   try {
      const resp = await client.query(strQuery);
      
      if ((resp.rows).length > 0) {
         res.status(200).json(resp.rows);
      } else {
         res.status(408).json({
            msg: 'Empleado no agregado...'
         });
      }
   } catch (err) {
      console.log(err.stack);

      res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.get('/api/:ced', async (req, res) => {
   const {
      ced: cedula
   } = req.params;

   const strQuery = 'SELECT * FROM employes WHERE cedula = $1';
   const values = [`${cedula}`];

   try {
      const resp = await client.query(strQuery, values);
      
      if ((resp.rows).length > 0) {
         res.status(200).json(resp.rows[0]);
      } else {
         res.status(408).json({
            msg: 'Empleado no encontrado...'
         });
      }
   } catch (err) {
      console.log(err.stack);

      res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.delete('/api/:ced', async (req, res) => {
   const {
      ced: cedula
   } = req.params;

   const strQuery = 'DELETE FROM employes WHERE cedula = $1';
   const values = [`${cedula}`,];

   try {
      const resp = await client.query(strQuery, values);
      
      if (resp.rowCount > 0) {
         res.status(200).json({
            msg: 'Empleado eliminado con éxito...'
         });
      } else {
         res.status(408).json({
            msg: 'Empleado no eliminado...'
         });
      }
   } catch (err) {
      console.log(err.stack);

      res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.put('/api', async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      salario
   } = req.body;

   const strQuery = 'UPDATE employes SET apellidos=$1, nombres=$2, salario=$3 WHERE cedula=$4';
   const values = [`${apellidos}`, `${nombres}`, `${salario}`, `${cedula}`];

   try {
      const resp = await client.query(strQuery, values);
      
      if (resp.rowCount > 0) {
         res.status(200).json({
            msg: 'Empleado actualizado con éxito...'
         });
      } else {
         res.status(408).json({
            msg: 'Empleado no actualizado...'
         });
      }
   } catch (err) {
      console.log(err.stack);

      res.status(500).json({
         msg: 'Error con el server x_x.'
      });
   }
});

app.listen(app.get('port'), () => {
   console.log(
      `[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] - Servidor en el puerto ${app.get('port')}`
   );
});
