jest.mock('../../../src/repositories/user.repository', () => ({
    findUser: jest.fn(),
    createUser: jest.fn(),
  }));
  
  jest.mock('../../../src/repositories/userProfile.repository', () => ({
    createUserProfile: jest.fn(),
  }));

  jest.mock('../../../db/models/index.js', () => ({
    sequelize: {
      transaction: jest.fn(() =>
        Promise.resolve({
          commit: jest.fn(),
          rollback: jest.fn(),
        })
      ),
    },
    Sequelize: {},
  }));