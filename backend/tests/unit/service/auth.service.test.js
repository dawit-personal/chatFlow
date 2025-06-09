require('../common/mocks');
jest.mock('../../../src/utils/hashPassword');
const authService = require('../../../src/services/auth.service');
const userRepository = require('../../../src/repositories/user.repository');
const userProfileRepository = require('../../../src/repositories/userProfile.repository');
const hashPassword = require('../../../src/utils/hashPassword');

describe('registerUser - service', () => {

  // Mock console.error to prevent console logs during tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new user and user profile successfully', async () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockHashedPassword = 'hashedPassword123';
    const mockUserId = 'abc123';
    const mockFirstName = 'John';
    const mockLastName = 'Doe';
    const mockProfilePicture = 'https://example.com/profile.png';

    userRepository.findUser.mockResolvedValue(null);
    hashPassword.mockResolvedValue(mockHashedPassword);
    userRepository.createUser.mockResolvedValue({
      userId: 'abc123',
      email: mockEmail,
    },
   
  );

    userProfileRepository.createUserProfile.mockResolvedValue({
      userId: mockUserId,
      firstName: mockFirstName,
      lastName: mockLastName,
      profilePicture: mockProfilePicture,
    },
  
  );

    const result = await authService.registerUser({
      email: mockEmail,
      password: mockPassword,
      firstName: mockFirstName,
      lastName: mockLastName,
      profilePicture: mockProfilePicture,
    });


    expect(userRepository.findUser).toHaveBeenCalledWith({ email: mockEmail }, ['userId']);
    expect(hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(userRepository.createUser).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockHashedPassword,
    },
    { transaction: expect.any(Object) }
  );

    expect(userProfileRepository.createUserProfile).toHaveBeenCalledWith({
      userId: mockUserId,
      firstName: mockFirstName,
      lastName: mockLastName,
      profilePicture: mockProfilePicture,
    },
    { transaction: expect.any(Object) }
  );

    expect(result).toEqual({
      userId: mockUserId,
      email: mockEmail,
      firstName: mockFirstName,
      lastName: mockLastName,
      profilePicture: mockProfilePicture,
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
