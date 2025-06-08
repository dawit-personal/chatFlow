const userProfileRepository = require('../repositories/userProfile.repository');

// @desc    Get user data by userId using the repository
// @param   userId - ID of the user
// @returns User object without sensitive fields
const getUserById = async (userId) => {
  const user = await userProfileRepository.findUserAndUserProfile({userId}, null);
  if (!user) {
    throw new Error('User not found');
  }

  const { password, ...safeUser } = user;
  return safeUser;
};

const searchByFirstName = async (firstName) => {
  const users = await userProfileRepository.findAllUsersByFirstName(firstName);
  return users;
}

module.exports = {
  getUserById,
  searchByFirstName,
};
