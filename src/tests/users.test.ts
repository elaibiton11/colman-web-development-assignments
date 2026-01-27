import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import User from '../models/user_model';

let userId: string;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Users API', () => {

    test('GET /users should return empty list initially', async () => {
        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /users should create a new user', async () => {
        const newUser = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        };
        const response = await request(app).post('/users').send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.username).toBe(newUser.username);
        expect(response.body.email).toBe(newUser.email);
        expect(response.body.password).toBe(newUser.password);
        
        userId = response.body._id;
    });

    test('GET /users should return the created user', async () => {
        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].username).toBe('testuser');
        expect(response.body[0].email).toBe('testuser@example.com');
    });

    test('GET /users/:id should return the user by id', async () => {
        const response = await request(app).get(`/users/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe('testuser');
        expect(response.body.email).toBe('testuser@example.com');
        expect(response.body.password).toBe('password123');
    });

    test('PUT /users/:id should update the user', async () => {
        const updatedUser = {
            username: 'updateduser',
            email: 'updateduser@example.com',
            password: 'newpassword456'
        };
        const response = await request(app).put(`/users/${userId}`).send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe(updatedUser.username);
        expect(response.body.email).toBe(updatedUser.email);
        expect(response.body.password).toBe(updatedUser.password);
    });

    test('DELETE /users/:id should delete the user', async () => {
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.statusCode).toBe(200);
    });

    test('POST /users should fail with invalid data', async () => {
        const response = await request(app).post('/users').send({});
        expect(response.statusCode).toBe(400);
    });

    test('GET /users/:id should fail with invalid id', async () => {
        const response = await request(app).get('/users/invalid_id');
        expect(response.statusCode).toBe(400);
    });

    test('GET /users/:id should fail if user not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/users/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
    });

    test('PUT /users/:id should fail with invalid id', async () => {
        const response = await request(app).put('/users/invalid_id').send({ username: 'new' });
        expect(response.statusCode).toBe(400);
    });

    test('PUT /users/:id should fail if user not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).put(`/users/${nonExistentId}`).send({ username: 'new' });
        expect(response.statusCode).toBe(404);
    });

    test('DELETE /users/:id should fail with invalid id', async () => {
        const response = await request(app).delete('/users/invalid_id');
        expect(response.statusCode).toBe(400);
    });

    test('DELETE /users/:id should fail if user not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).delete(`/users/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
    });
});
