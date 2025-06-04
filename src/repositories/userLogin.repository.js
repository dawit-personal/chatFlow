const { UserLogin } = require('../../db/models');

class UserLoginRepository {
  async createLogin(data) {
    return await UserLogin.create(data);
  }

  async getLoginById(id) {
    return await UserLogin.findByPk(id);
  }

  async getAllLogins() {
    return await UserLogin.findAll();
  }

  async updateLogin(id, updates) {
    const login = await UserLogin.findByPk(id);
    if (!login) return null;
    return await login.update(updates);
  }

  async deleteLogin(id) {
    return await UserLogin.destroy({ where: { id } });
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
}

module.exports = new UserLoginRepository();
