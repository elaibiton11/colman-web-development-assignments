import authPaths from './auth';
import postsPaths from './posts';
import usersPaths from './users';
import commentsPaths from './comments';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Web Dev Course API',
    version: '1.0.0',
    description: 'API documentation for the Posts, Comments, and Users application',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication operations' },
    { name: 'Posts', description: 'Post operations' },
    { name: 'Comments', description: 'Comment operations' },
    { name: 'Users', description: 'User operations' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'Post ID' },
          title: { type: 'string', description: 'Post title' },
          content: { type: 'string', description: 'Post content' },
          sender: { type: 'string', description: 'ID of the sender' },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'Comment ID' },
          postId: { type: 'string', description: 'ID of the post' },
          sender: { type: 'string', description: 'Name of the sender' },
          message: { type: 'string', description: 'Comment message' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'User ID' },
          username: { type: 'string', description: 'Username' },
          email: { type: 'string', description: 'User email' },
        },
      },
    },
  },
  paths: {
    ...authPaths,
    ...postsPaths,
    ...usersPaths,
    ...commentsPaths,
  },
};

export default swaggerDocument;
