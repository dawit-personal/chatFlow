const { MessageStatus } = require('../../db/models');

class MessageStatusRepository {
  async createMessageStatus(data, options = {}) {
    return await MessageStatus.create(data, options);
  }

  async getMessageStatusById(id) {
    return await MessageStatus.findByPk(id);
  }

  async getAllMessageStatuss() {
    return await MessageStatus.findAll();
  }

  async updateMessageStatus(id, updates, options = {}) {
    const item = await MessageStatus.findByPk(id, options);
    if (!item) return null;
    return await item.update(updates, options);
  }

  async deleteMessageStatus(id, options = {}) {
    return await MessageStatus.destroy({ where: { id }, ...options });
  }

  async countMessageStatuss() {
    return await MessageStatus.count();
  }

  async findMessageStatus(where = {}, attributes = null) {
    return await MessageStatus.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }

  async findAllMessageStatuss({ where = {}, offset = 0, limit = 10 }) {
    return await MessageStatus.findAll({
      where,
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
      raw: true,
    });
  }
}

module.exports = new MessageStatusRepository();
