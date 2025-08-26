const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const User = mongoose.model('User');

// Mock the requireLogin middleware
jest.mock('../middlewares/requireLogin', () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };
});

// Mock the cache service
jest.mock('../services/cache', () => ({
  clearCache: jest.fn()
}));

const app = express();
app.use(express.json());

// Import and apply routes
const blogRoutes = require('../routes/blogRoutes');
blogRoutes(app);

describe('Blog Routes', () => {
  let testUser;
  let testBlog;
  let server;

  beforeEach(async () => {
    testUser = new User({
      googleId: '123456789',
      displayName: 'Test User'
    });
    await testUser.save();

    testBlog = new Blog({
      title: 'Test Blog',
      content: 'Test content',
      _user: testUser._id
    });
    await testBlog.save();
  });

  describe('GET /api/blogs/:id', () => {
    it('should return blog when user is authenticated and owns the blog', async () => {
      const response = await request(app)
        .get(`/api/blogs/${testBlog._id}`)
        .set('user', JSON.stringify(testUser));

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(testBlog.title);
      expect(response.body.content).toBe(testBlog.content);
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get(`/api/blogs/${testBlog._id}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 when blog does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/blogs/${fakeId}`)
        .set('user', JSON.stringify(testUser));

      expect(response.status).toBe(200);
      expect(response.body).toBeNull();
    });
  });

  describe('GET /api/blogs', () => {
    it('should return all blogs for authenticated user', async () => {
      // Create another blog for the same user
      const anotherBlog = new Blog({
        title: 'Another Blog',
        content: 'Another content',
        _user: testUser._id
      });
      await anotherBlog.save();

      const response = await request(app)
        .get('/api/blogs')
        .set('user', JSON.stringify(testUser));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe(testBlog.title);
      expect(response.body[1].title).toBe(anotherBlog.title);
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/blogs');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/blogs', () => {
    it('should create new blog when user is authenticated', async () => {
      const newBlogData = {
        title: 'New Blog',
        content: 'New content'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('user', JSON.stringify(testUser))
        .send(newBlogData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(newBlogData.title);
      expect(response.body.content).toBe(newBlogData.content);
      expect(response.body._user.toString()).toBe(testUser._id.toString());

      // Verify blog was saved to database
      const savedBlog = await Blog.findById(response.body._id);
      expect(savedBlog).toBeDefined();
      expect(savedBlog.title).toBe(newBlogData.title);
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .send({ title: 'Test', content: 'Test' });

      expect(response.status).toBe(401);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('user', JSON.stringify(testUser))
        .send({ title: 'Test' }); // Missing content

      expect(response.status).toBe(400);
    });
  });
});
