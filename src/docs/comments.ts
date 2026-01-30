const commentsPaths = {
  '/comments': {
    get: {
      tags: ['Comments'],
      summary: 'Get comments',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'post',
          in: 'query',
          description: 'Filter by post ID',
          schema: { type: 'string' },
        },
      ],
      responses: {
        '200': {
          description: 'List of comments',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Comment',
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Comments'],
      summary: 'Create a new comment',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['postId', 'sender', 'message'],
              properties: {
                postId: { type: 'string' },
                sender: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Comment created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Comment',
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
  '/comments/{id}': {
    get: {
      tags: ['Comments'],
      summary: 'Get comment by ID',
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
          description: 'Comment details',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Comment',
              },
            },
          },
        },
        '404': {
          description: 'Comment not found',
        },
      },
    },
    put: {
      tags: ['Comments'],
      summary: 'Update comment',
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
                message: { type: 'string' },
                sender: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Comment updated',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Comment',
              },
            },
          },
        },
        '404': {
          description: 'Comment not found',
        },
      },
    },
    delete: {
      tags: ['Comments'],
      summary: 'Delete comment',
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
        '204': {
          description: 'Comment deleted',
        },
        '404': {
          description: 'Comment not found',
        },
      },
    },
  },
};

export default commentsPaths;
