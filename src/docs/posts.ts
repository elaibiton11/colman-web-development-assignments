const postsPaths = {
  '/post': {
    get: {
      tags: ['Posts'],
      summary: 'Get all posts',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'sender',
          in: 'query',
          description: 'Filter by sender ID',
          schema: { type: 'string' },
        },
      ],
      responses: {
        '200': {
          description: 'List of posts',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Post',
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Posts'],
      summary: 'Create a new post',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'content'],
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Post created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Post',
              },
            },
          },
        },
        '400': {
          description: 'Invalid input',
        },
      },
    },
  },
  '/post/{id}': {
    get: {
      tags: ['Posts'],
      summary: 'Get post by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        '200': {
          description: 'Post details',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Post',
              },
            },
          },
        },
        '404': {
          description: 'Post not found',
        },
      },
    },
    put: {
      tags: ['Posts'],
      summary: 'Update post',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Post updated',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Post',
              },
            },
          },
        },
        '404': {
          description: 'Post not found',
        },
      },
    },
    delete: {
      tags: ['Posts'],
      summary: 'Delete post',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        '200': {
          description: 'Post deleted',
        },
        '404': {
          description: 'Post not found',
        },
      },
    },
  },
};

export default postsPaths;
