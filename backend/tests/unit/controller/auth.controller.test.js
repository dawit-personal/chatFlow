const httpMocks = require('node-mocks-http');
const authController = require('../../../src/api/controllers/auth.controller');
const authService = require('../../../src/services/auth.service');

// Mock the authService methods
jest.mock('../../../src/services/auth.service');

// Reusable mock request body generator
const getMockRegisterBody = (overrides = {}) => ({
  email: 'test@test.com',
  password: 'Str0ng@Password!',
  confirmPassword: 'Str0ng@Password!', // Used only where needed
  firstName: 'John',
  lastName: 'Doe',
  profilePicture: 'https://example.com/profile.jpg',
  ...overrides,
});

describe('Auth Controller - register', () => {

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 201 and user data when registration is successful', async () => {
    const reqBody = getMockRegisterBody();
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/auth/register',
      body: reqBody,
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authService.registerUser.mockResolvedValue({
      email: reqBody.email,
      userId: 'mock-user-id',
    });

    await authController.register(req, res, next);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data).toEqual({
      message: 'User registered successfully',
      email: reqBody.email,
    });

    const expectedServiceInput = { ...reqBody };
    delete expectedServiceInput.confirmPassword; // ❗ remove confirmPassword

    expect(authService.registerUser).toHaveBeenCalledWith(expectedServiceInput);
  });

  test('should return 409 if email already exists', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/auth/register',
      body: getMockRegisterBody({ email: 'existing@test.com' }),
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authService.registerUser.mockRejectedValue(new Error('Email already exists'));

    await authController.register(req, res, next);

    expect(res.statusCode).toBe(409);
    expect(res._getJSONData()).toEqual({ message: 'Email already exists' });
  });

  test('should return 500 on unexpected server error', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/auth/register',
      body: getMockRegisterBody(),
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authService.registerUser.mockRejectedValue(new Error('Unexpected DB failure'));

    await authController.register(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Server error during registration.' });
  });
});
