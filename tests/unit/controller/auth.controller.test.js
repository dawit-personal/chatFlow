jest.mock('../../../src/services/auth.service');

const httpMocks = require('node-mocks-http');
const authController = require('../../../src/api/controllers/auth.controller');
const authService = require('../../../src/services/auth.service');

describe('Auth Controller - register', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('should return 201 and user data when registration is successful', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/auth/register',
      body: {
        email: 'test@test.com',
        password: 'Str0ng@Password!',
        confirmPassword: 'Str0ng@Password!',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authService.registerUser.mockResolvedValue({
      email: 'test@test.com',
      userId: 'mock-user-id',
    });

    await authController.register(req, res, next);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data).toEqual({
      message: 'User registered successfully',
      email: 'test@test.com',
    });
    expect(authService.registerUser).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'Str0ng@Password!',
    });
  });

  test('should return 409 if email already exists', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/auth/register',
      body: {
        email: 'existing@test.com',
        password: 'Str0ng@Password!',
        confirmPassword: 'Str0ng@Password!',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Temporarily silence console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    authService.registerUser.mockRejectedValue(new Error('Email already exists'));

    await authController.register(req, res, next);

    expect(res.statusCode).toBe(409);
    const data = res._getJSONData();
    expect(data).toEqual({ message: 'Email already exists' });
  });
});
