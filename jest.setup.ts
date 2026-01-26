// Test setup: ensure environment variables needed by the app are present
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jest-test-db';

export {};
