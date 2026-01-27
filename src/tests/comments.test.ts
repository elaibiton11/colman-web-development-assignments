import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import Comment from '../models/comment_model';
import Post from '../models/post_model';
import UserModel from '../models/user_model';

let commentId: string;
let postId: string;
let accessToken: string;

process.env.TOKEN_SECRET = 'test_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await UserModel.deleteMany({});

    await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    });
    const loginRes = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
    });
    accessToken = loginRes.body.accessToken;

    // Create a post to associate comments with
    const newPost = await Post.create({
        title: 'Test Post for Comments',
        content: 'Test Content',
        sender: 'Test Sender'
    });
    postId = newPost._id.toString();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Comments API', () => {

    test('GET /comments should return empty list initially', async () => {
        const response = await request(app).get('/comments')
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /comments should create a new comment', async () => {
        const newComment = {
            postId: postId,
            sender: 'Test Commenter',
            message: 'Test Comment Message'
        };
        const response = await request(app).post('/comments')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(newComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.postId).toBe(postId);
        expect(response.body.sender).toBe(newComment.sender);
        expect(response.body.message).toBe(newComment.message);

        commentId = response.body._id;
    });

    test('GET /comments should return the created comment', async () => {
        const response = await request(app).get('/comments')
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].sender).toBe('Test Commenter');
        expect(response.body[0].message).toBe('Test Comment Message');
    });

    test('GET /comments/:id should return the comment by id', async () => {
        const response = await request(app).get(`/comments/${commentId}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.sender).toBe('Test Commenter');
        expect(response.body.message).toBe('Test Comment Message');
        expect(response.body.postId).toBe(postId);
    });

    test('PUT /comments/:id should update the comment', async () => {
        const updatedComment = {
            postId: postId,
            sender: 'Updated Commenter',
            message: 'Updated Comment Message'
        };
        const response = await request(app).put(`/comments/${commentId}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(updatedComment);
        expect(response.statusCode).toBe(200);
        expect(response.body.sender).toBe(updatedComment.sender);
        expect(response.body.message).toBe(updatedComment.message);
    });

    test('DELETE /comments/:id should delete the comment', async () => {
        const response = await request(app).delete(`/comments/${commentId}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(204);
    });

    test('POST /comments should fail with invalid data', async () => {
        const response = await request(app).post('/comments')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({});
        expect(response.statusCode).toBe(400);
    });

    test('POST /comments should fail with non-existent postId', async () => {
        const nonExistentPostId = new mongoose.Types.ObjectId();
        const response = await request(app).post('/comments')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
            postId: nonExistentPostId,
            sender: 'Test',
            message: 'Test'
        });
        expect(response.statusCode).toBe(400);
    });

    test('GET /comments/:id should fail with invalid id', async () => {
        const response = await request(app).get('/comments/invalid_id')
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(500);
    });

    test('GET /comments/:id should fail if comment not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/comments/${nonExistentId}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(404);
    });

    test('PUT /comments/:id should fail with invalid id', async () => {
        const response = await request(app).put('/comments/invalid_id')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
            postId: postId,
            sender: 'Test',
            message: 'Test'
        });
        expect(response.statusCode).toBe(500);
    });

    test('PUT /comments/:id should fail if comment not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).put(`/comments/${nonExistentId}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
            postId: postId,
            sender: 'Test',
            message: 'Test'
        });
        expect(response.statusCode).toBe(404);
    });

    test('DELETE /comments/:id should fail with invalid id', async () => {
        const response = await request(app).delete('/comments/invalid_id')
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(500);
    });

    test('DELETE /comments/:id should fail if comment not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).delete(`/comments/${nonExistentId}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.statusCode).toBe(404);
    });

    test('GET /comments with query filter should return comments for a specific post', async () => {
        const newComment = {
            postId: postId,
            sender: 'Another Commenter',
            message: 'Another Comment'
        };
        await request(app).post('/comments')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(newComment);

        const response = await request(app).get('/comments')
            .set('Authorization', 'Bearer ' + accessToken)
            .query({ post: postId });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].postId).toBe(postId);
    });
});
