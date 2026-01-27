import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import postRouter from './routes/post_routes';
import commentRouter from './routes/comment_routes';
import userRouter from './routes/user_routes';
import authRouter from './routes/auth_routes';
import authMiddleware from './middlewares/auth_middleware';
import db from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/post', authMiddleware, postRouter);
app.use('/comments', authMiddleware, commentRouter);
app.use('/users', authMiddleware, userRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Posts & Comments API' });
});

if (process.env.NODE_ENV !== 'test') {
  db.connect().then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  });
}

export default app;