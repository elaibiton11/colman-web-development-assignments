require('dotenv').config();
const express = require('express');
const db = require('./config/db');


const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

  db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
