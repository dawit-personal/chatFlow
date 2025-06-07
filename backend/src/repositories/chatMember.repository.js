const { ChatMember } = require('../../db/models');

class ChatMemberRepository {
  async createChatMember(data, options = {}) {
    return await ChatMember.create(data, options);
  }

  async findOrCreateChatMember(data, options = {}) {
    return await ChatMember.findOrCreate({
      where: { chatId: data.chatId, userId: data.userId },
      defaults: data,
      ...options
    });
  }

  async getChatMemberById(id) {
    return await ChatMember.findByPk(id);
  }

  async getAllChatMembers() {
    return await ChatMember.findAll();
  }

  async updateChatMember(id, updates, options = {}) {
    const item = await ChatMember.findByPk(id, options);
    if (!item) return null;
    return await item.update(updates, options);
  }

  async deleteChatMember(id, options = {}) {
    return await ChatMember.destroy({ where: { id }, ...options });
  }

  async countChatMembers() {
    return await ChatMember.count();
  }

  async findChatMember(where = {}, attributes = null) {
    return await ChatMember.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }

  async findAllChatMembers({ where = {}, offset = 0, limit = 10 }) {
    return await ChatMember.findAll({
      where,
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
      raw: true,
    });
  }
}

module.exports = new ChatMemberRepository();
