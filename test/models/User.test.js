const mongoose = require('mongoose');
const User = mongoose.model('User');

describe('User Model Test', () => {
  it('should create & save user successfully', async () => {
    const validUser = new User({
      googleId: '123456789',
      displayName: 'Test User'
    });
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.googleId).toBe(validUser.googleId);
    expect(savedUser.displayName).toBe(validUser.displayName);
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({ displayName: 'Test User' });
    let err;
    
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should save user with only googleId', async () => {
    const userWithOnlyGoogleId = new User({ googleId: '123456789' });
    const savedUser = await userWithOnlyGoogleId.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.googleId).toBe('123456789');
    expect(savedUser.displayName).toBeUndefined();
  });
});
