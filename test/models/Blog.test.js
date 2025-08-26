const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const User = mongoose.model('User');

describe('Blog Model Test', () => {
  let testUser;

  beforeEach(async () => {
    testUser = new User({
      googleId: '123456789',
      displayName: 'Test User'
    });
    await testUser.save();
  });

  it('should create & save blog successfully', async () => {
    const validBlog = new Blog({
      title: 'Test Blog',
      content: 'This is a test blog content',
      _user: testUser._id
    });
    const savedBlog = await validBlog.save();
    
    expect(savedBlog._id).toBeDefined();
    expect(savedBlog.title).toBe(validBlog.title);
    expect(savedBlog.content).toBe(validBlog.content);
    expect(savedBlog._user.toString()).toBe(testUser._id.toString());
    expect(savedBlog.createdAt).toBeDefined();
  });

  it('should fail to save blog without required fields', async () => {
    const blogWithoutRequiredField = new Blog({ title: 'Test Blog' });
    let err;
    
    try {
      await blogWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should automatically set createdAt timestamp', async () => {
    const blog = new Blog({
      title: 'Test Blog',
      content: 'Test content',
      _user: testUser._id
    });
    
    const beforeSave = Date.now();
    await blog.save();
    const afterSave = Date.now();
    
    expect(blog.createdAt).toBeDefined();
    expect(blog.createdAt.getTime()).toBeGreaterThanOrEqual(beforeSave);
    expect(blog.createdAt.getTime()).toBeLessThanOrEqual(afterSave);
  });

  it('should populate user reference', async () => {
    const blog = new Blog({
      title: 'Test Blog',
      content: 'Test content',
      _user: testUser._id
    });
    await blog.save();
    
    const populatedBlog = await Blog.findById(blog._id).populate('_user');
    
    expect(populatedBlog._user).toBeDefined();
    expect(populatedBlog._user.googleId).toBe(testUser.googleId);
    expect(populatedBlog._user.displayName).toBe(testUser.displayName);
  });
});
