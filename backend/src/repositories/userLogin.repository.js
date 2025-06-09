const { UserLogin } = require('../../db/models');

class UserLoginRepository {
  async createLogin(data, options = {}) {
    return await UserLogin.create(data, options);
  }

  async getLoginById(id) {
    return await UserLogin.findByPk(id);
  }

  async getAllLogins() {
    return await UserLogin.findAll();
  }

  async updateLogin(id, updates, options = {}) {
    const login = await UserLogin.findByPk(id);
    if (!login) return null;
    return await login.update(updates, options);
  }

  async deleteLogin(id, options = {}) {
    return await UserLogin.destroy({ where: { id }, ...options });
  }

  async findLogin(where = {}, attributes = null) {
    return await UserLogin.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }

  async findAllLogins(where = {}, attributes = null) {
    return await UserLogin.findAll({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }

  async genericUpdate(where = {}, updates = {}, options = {}) {
    return await UserLogin.update(updates, {
      where,
      ...options,
    });
  }
}

module.exports = new UserLoginRepository();
