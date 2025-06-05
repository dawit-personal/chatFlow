const { UserProfile } = require('../../db/models');

class UserProfileRepository {
  async createUserProfile(data, options = {}) {
    return await UserProfile.create(data, options);
  }

  async getUserProfileById(id) {
    return await UserProfile.findByPk(id);
  }

  async getAllUserProfiles() {
    return await UserProfile.findAll();
  }

  async updateUserProfile(id, updates, options = {}) {
    const item = await UserProfile.findByPk(id);
    if (!item) return null;
    return await item.update(updates, options);
  }

  async deleteUserProfile(id, options = {}) {
    return await UserProfile.destroy({ where: { id }, ...options });
  }

  async countUserProfiles() {
    return await UserProfile.count();
  }

  async findUserProfile(where = {}, attributes = null) {
    return await UserProfile.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }
}

module.exports = new UserProfileRepository();
