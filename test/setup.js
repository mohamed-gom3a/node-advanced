const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Mock Redis for tests
jest.mock('../services/cache', () => ({
  clearCache: jest.fn(),
}));

// Mock passport service to avoid OAuth configuration errors
jest.mock('../services/passport', () => ({
  googleStrategy: {
    authenticate: jest.fn()
  },
  serializeUser: jest.fn(),
  deserializeUser: jest.fn()
}));
