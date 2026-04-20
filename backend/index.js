const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('¡Servidor funcionando en Senati!');
});

app.listen(port, () => {
  console.log(`Ejecutando en http://localhost:${port}`);
});