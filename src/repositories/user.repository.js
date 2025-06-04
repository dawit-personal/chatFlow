const { User } = require('../../db/models');

class UserRepository {
  async createUser(data) {
    return await User.create(data);
  }

  async getUserById(userId) {
    return await User.findByPk(userId);
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async updateUser(userId, updates) {
    const user = await User.findByPk(userId);
    if (!user) return null;
    return await user.update(updates);
  }

  async deleteUser(userId) {
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
