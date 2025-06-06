const { MessageStatuses } = require('../../db/models');

class MessageStatusesRepository {
  async createMessageStatuses(data) {
    return await MessageStatuses.create(data);
  }

  async getMessageStatusesById(id) {
    return await MessageStatuses.findByPk(id);
  }

  async getAllMessageStatusess() {
    return await MessageStatuses.findAll();
  }

  async updateMessageStatuses(id, updates) {
    const item = await MessageStatuses.findByPk(id);
    if (!item) return null;
    return await item.update(updates);
  }

  async deleteMessageStatuses(id) {
    return await MessageStatuses.destroy({ where: { id } });
  }

  async countMessageStatusess() {
    return await MessageStatuses.count();
  }

  async findMessageStatuses(where = {}, attributes = null) {
    return await MessageStatuses.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }
}

module.exports = new MessageStatusesRepository();
