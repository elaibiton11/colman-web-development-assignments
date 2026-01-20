require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');


const app = express();

app.use(express.json())
app.use('/post', postRoutes);
app.use('/comments', commentRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Posts & Comments API' });
});

const PORT = process.env.PORT || 3000;

  db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
