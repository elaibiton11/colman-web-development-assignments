import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import postRouter from './routes/post_routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/post', postRouter);

const commentRouter = require('./routes/commentRoutes');
const db = require('./config/db');
app.use('/comments', commentRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Posts & Comments API' });
});

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});