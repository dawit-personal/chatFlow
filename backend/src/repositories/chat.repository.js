const { Chat, ChatMember } = require('../../db/models');

class ChatRepository {
  async createChat(data, options = {}) {
    return await Chat.create(data, options);
  }

  async getChatById(id) {
    return await Chat.findByPk(id);
  }

  async getAllChats(where = {}, attributes = null) {
    return await Chat.findAll({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }

  async updateChat(id, updates, options = {}) {
    const item = await Chat.findByPk(id, options);
    if (!item) return null;
    return await item.update(updates, options);
  }

  async deleteChat(id, options = {}) {
    return await Chat.destroy({ where: { id }, ...options });
  }

  async countChats() {
    return await Chat.count();
  }

  async findChat(where = {}, attributes = null) {
    return await Chat.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }

  async findAllChats({ where = {}, offset = 0, limit = 10 }) {
    return await Chat.findAll({
      where,
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
      raw: true,
    });
  }

  async findOneToOneChat(userId, participantId) {
    return await Chat.findOne({
      where: { userId },
      include: [{
        model: ChatMember,
        as: 'members',
        where: { userId: participantId }
      }]
    });
  }
}

module.exports = new ChatRepository();
