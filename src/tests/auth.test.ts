import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import app from '../index';
import UserModel from '../models/user_model';

// Ensure we have a secret for JWT generation in tests
process.env.TOKEN_SECRET = 'test_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';

let testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
};

beforeAll(async () => {
    // Connect to a test database
    const url = process.env.DB_URL || 'mongodb://localhost:27017/test_posts_db';
    await mongoose.connect(url);
});

afterAll(async () => {
    // Close connection after tests
    await mongoose.connection.close();
});

describe('Auth API Tests', () => {
    // Clear database before each test
    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    test('POST /auth/register - should register new user', async () => {
        const newUser = {
            username: 'newuser',
            email: 'new@example.com',
            password: 'password123'
        };
        const response = await request(app).post('/auth/register').send(newUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(newUser.email);
        expect(response.body.username).toBe(newUser.username);
    });

    test('POST /auth/login - should login successfully with valid credentials', async () => {
        // Create user directly in DB
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await UserModel.create({
            ...testUser,
            password: hashedPassword
        });

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body).toHaveProperty('_id');
    });

    test('POST /auth/refresh - should return new tokens with valid refresh token', async () => {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await UserModel.create({
            ...testUser,
            password: hashedPassword
        });
        
        // 1. Login to get tokens
        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
            
        const refreshToken = loginRes.body.refreshToken;

        // 2. Use refresh token to get new access token
        const response = await request(app)
            .post('/auth/refresh')
            .send({ refreshToken });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        // expect(response.body.refreshToken).not.toBe(refreshToken); // Expecting token rotation
    });

    test('POST /auth/logout - should remove refresh token', async () => {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await UserModel.create({
            ...testUser,
            password: hashedPassword
        });
        
        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
            
        const refreshToken = loginRes.body.refreshToken;

        const response = await request(app)
            .post('/auth/logout')
            .send({ refreshToken });

        expect(response.statusCode).toBe(200);
        
        // Verify token is removed from DB
        const user = await UserModel.findOne({ email: testUser.email });
        expect(user?.refreshTokens).not.toContain(refreshToken);
    });
});
