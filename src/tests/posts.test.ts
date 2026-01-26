import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import Post from '../models/post_model';

let postId: string;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    await Post.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Posts API', () => {

    test('GET /posts should return empty list initially', async () => {
        const response = await request(app).get('/post');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /posts should create a new post', async () => {
        const newPost = {
            title: 'Test Title',
            content: 'Test Content',
            sender: 'Test Sender'
        };
        const response = await request(app).post('/post').send(newPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newPost.title);
        expect(response.body.content).toBe(newPost.content);
        expect(response.body.sender).toBe(newPost.sender);
        
        postId = response.body._id;
    });

    test('GET /posts should return the created post', async () => {
        const response = await request(app).get('/post');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('Test Title');
        expect(response.body[0].content).toBe('Test Content');
        expect(response.body[0].sender).toBe('Test Sender');
    });

    test('GET /posts/:id should return the post by id', async () => {
        const response = await request(app).get(`/post/${postId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Test Title');
        expect(response.body.content).toBe('Test Content');
        expect(response.body.sender).toBe('Test Sender');
    });

    test('PUT /posts/:id should update the post', async () => {
        const updatedPost = {
            title: 'Updated Title',
            content: 'Updated Content'
        };
        const response = await request(app).put(`/post/${postId}`).send(updatedPost);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedPost.title);
        expect(response.body.content).toBe(updatedPost.content);
    });

    test('DELETE /post/:id should delete the post', async () => {
        const response = await request(app).delete(`/post/${postId}`);
        expect(response.statusCode).toBe(200);
    });

    test('POST /post should fail with invalid data', async () => {
        const response = await request(app).post('/post').send({});
        expect(response.statusCode).toBe(400);
    });

    test('GET /post/:id should fail with invalid id', async () => {
        const response = await request(app).get('/post/invalid_id');
        expect(response.statusCode).toBe(400);
    });

    test('GET /post/:id should fail if post not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/post/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
    });

    test('PUT /post/:id should fail with invalid id', async () => {
        const response = await request(app).put('/post/invalid_id').send({ title: 'New' });
        expect(response.statusCode).toBe(400);
    });

    test('PUT /post/:id should fail if post not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).put(`/post/${nonExistentId}`).send({ title: 'New' });
        expect(response.statusCode).toBe(404);
    });

    test('DELETE /post/:id should fail with invalid id', async () => {
        const response = await request(app).delete('/post/invalid_id');
        expect(response.statusCode).toBe(400);
    });

    test('DELETE /post/:id should fail if post not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).delete(`/post/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
    });
});
