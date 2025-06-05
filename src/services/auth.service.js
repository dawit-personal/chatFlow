const userRepository = require('../repositories/user.repository');
const hashPassword = require('../utils/hashPassword');
const comparePassword = require('../utils/comparePassword'); 
const {generateToken} = require('../utils/generateToken'); 
const userLoginRepository = require('../repositories/userLogin.repository');
const userProfileRepository = require('../repositories/userProfile.repository');
const jwt = require('jsonwebtoken');
const DBService = require('./db.service');

// @desc    Register a new user using the repository
// @param   userData - Object containing email and password
async function registerUser(userData) {
  const { email, password, firstName, lastName, profilePicture } = userData;

  return await DBService.performTransaction(async (transaction) => {
    // Check if user already exists (no transaction needed here unless you're doing SELECT ... FOR UPDATE)
    const existingUser = await userRepository.findUser({ email }, ['userId']);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await hashPassword(password);

    // Pass transaction to all operations that write to the DB
    const newUser = await userRepository.createUser({
      email,
      password: hashedPassword,
    }, { transaction });

    const userProfile = await userProfileRepository.createUserProfile({
      userId: newUser.userId,
      firstName,
      lastName,
      profilePicture
    }, { transaction });

    return {
      userId: newUser.userId,
      email: newUser.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      profilePicture: userProfile.profilePicture,
      message: 'User created successfully',
    };
  });
}

// @desc    Authenticate user and return JWT
// @param   credentials - Object containing email and password
async function loginUser(credentials, ipAddress, userAgent) {
  const { email, password } = credentials;

  const user = await userRepository.findUser({ email }, ['userId', 'email', 'password']);
  console.log(user);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({ userId: user.userId, email: user.email });

  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  const userLogin = await userLoginRepository.createLogin({
    userId: user.userId,
    token,
    status: 'active',
    ipAddress,
    userAgent,
    expiresAt
  });

  return {
    email: user.email,
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};
