const userRepository = require('../repositories/user.repository');
const hashPassword = require('../utils/hashPassword');
const comparePassword = require('../utils/comparePassword'); 
const generateToken = require('../utils/generateToken'); 
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

// @desc    Authenticate user and return JWT
// @param   credentials - Object containing email and password
async function loginUser(credentials) {
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

  //const token = generateToken({ userId: user.userId, email: user.email });

  return {
    email: user.email,
    //token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};
