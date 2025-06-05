const { User } = require('../../db/models');

class UserRepository {
  async createUser(data, options = {}) {
    return await User.create(data, options);
  }

  async getUserById(userId) {
    return await User.findByPk(userId);
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async updateUser(userId, updates, options = {}) {
    const user = await User.findByPk(userId);
    if (!user) return null;
    return await user.update(updates, options);
  }

  async deleteUser(userId, options = {}) {
    return await User.destroy({ where: { userId } });
  }

  async countUsers() {
    return await User.count();
  }

  async findUser(where = {}, attributes = null) {
    return await User.findOne({
      where,
      attributes: attributes || null,
      raw: true, 
    });
  }
}

module.exports = new UserRepository();
