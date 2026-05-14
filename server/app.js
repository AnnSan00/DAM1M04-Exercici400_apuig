const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serveix els fitxers de la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
    console.log(`Puzzle funcionant a http://localhost:${port}`);
});