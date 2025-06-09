const { Message } = require('../../db/models');

class MessageRepository {
  async createMessage(data, options = {}) {
    return await Message.create(data, options);
  }

  async getMessageById(id) {
    return await Message.findByPk(id);
  }

  async getAllMessages() {
    return await Message.findAll();
  }

  async updateMessage(id, updates, options = {}) {
    const item = await Message.findByPk(id, options);
    if (!item) return null;
    return await item.update(updates, options);
  }

  async deleteMessage(id, options = {}) {
    return await Message.destroy({ where: { id }, ...options });
  }

  async countMessages() {
    return await Message.count();
  }

  async findMessage(where = {}, attributes = null) {
    return await Message.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }

  async findAllMessages({ where = {}, offset = 0, limit = 10 }) {
    return await Message.findAll({
      where,
      offset,
      limit,
      order: [['timestamp', 'ASC']],
      raw: true,
    });
  }
}

module.exports = new MessageRepository();
