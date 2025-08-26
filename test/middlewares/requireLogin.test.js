const requireLogin = require('../middlewares/requireLogin');

describe('requireLogin Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should call next() when user is authenticated', () => {
    mockReq.user = { id: '123', displayName: 'Test User' };

    requireLogin(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.send).not.toHaveBeenCalled();
  });

  it('should return 401 status when user is not authenticated', () => {
    requireLogin(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith({ error: 'You must log in!' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 status when user is undefined', () => {
    mockReq.user = undefined;

    requireLogin(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith({ error: 'You must log in!' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 status when user is empty object', () => {
    mockReq.user = {};

    requireLogin(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith({ error: 'You must log in!' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
