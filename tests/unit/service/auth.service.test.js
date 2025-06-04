require('../common/mocks');
jest.mock('../../../src/utils/hashPassword');
const authService = require('../../../src/services/auth.service');
const userRepository = require('../../../src/repositories/user.repository');
const hashPassword = require('../../../src/utils/hashPassword');

describe('registerUser - service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('should create a new user successfully', async () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockHashedPassword = 'hashedPassword123';

    userRepository.findUser.mockResolvedValue(null);
    hashPassword.mockResolvedValue(mockHashedPassword);
    userRepository.createUser.mockResolvedValue({
      userId: 'abc123',
      email: mockEmail,
    });

    const result = await authService.registerUser({
      email: mockEmail,
      password: mockPassword,
    });

    expect(userRepository.findUser).toHaveBeenCalledWith({ email: mockEmail }, ['userId']);
    expect(hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(userRepository.createUser).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockHashedPassword,
    });

    expect(result).toEqual({
      userId: 'abc123',
      email: mockEmail,
      message: 'User created successfully',
    });
  });

  test('should throw error if user already exists', async () => {
    userRepository.findUser.mockResolvedValue({ userId: 'existing-user-id' });

    await expect(
      authService.registerUser({
        email: 'test@example.com',
        password: 'any',
      })
    ).rejects.toThrow('Email already exists');

    expect(userRepository.createUser).not.toHaveBeenCalled();
  });
});
