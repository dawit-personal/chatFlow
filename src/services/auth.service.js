const userRepository = require('../repositories/user.repository');
const hashPassword = require('../utils/hashPassword');

// @desc    Register a new user using the repository
// @param   userData - Object containing email and password
async function registerUser(userData) {
  const { email, password } = userData;

  // Check if user already exists
  const existingUser = await userRepository.findUser({ email }, ['userId']);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Securely hash the password
  const hashedPassword = await hashPassword(password);

  // Save user using the repository
  const newUser = await userRepository.createUser({
    email,
    password: hashedPassword,
  });

  return {
    userId: newUser.userId,
    email: newUser.email,
    message: 'User created successfully',
  };
}

module.exports = {
  registerUser,
};
