const { Messages } = require('../../db/models');

class MessagesRepository {
  async createMessages(data) {
    return await Messages.create(data);
  }

  async getMessagesById(id) {
    return await Messages.findByPk(id);
  }

  async getAllMessagess() {
    return await Messages.findAll();
  }

  async updateMessages(id, updates) {
    const item = await Messages.findByPk(id);
    if (!item) return null;
    return await item.update(updates);
  }

  async deleteMessages(id) {
    return await Messages.destroy({ where: { id } });
  }

  async countMessagess() {
    return await Messages.count();
  }

  async findMessages(where = {}, attributes = null) {
    return await Messages.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }
}

module.exports = new MessagesRepository();
