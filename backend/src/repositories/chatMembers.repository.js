const { ChatMembers } = require('../../db/models');

class ChatMembersRepository {
  async createChatMembers(data) {
    return await ChatMembers.create(data);
  }

  async getChatMembersById(id) {
    return await ChatMembers.findByPk(id);
  }

  async getAllChatMemberss() {
    return await ChatMembers.findAll();
  }

  async updateChatMembers(id, updates) {
    const item = await ChatMembers.findByPk(id);
    if (!item) return null;
    return await item.update(updates);
  }

  async deleteChatMembers(id) {
    return await ChatMembers.destroy({ where: { id } });
  }

  async countChatMemberss() {
    return await ChatMembers.count();
  }

  async findChatMembers(where = {}, attributes = null) {
    return await ChatMembers.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }
}

module.exports = new ChatMembersRepository();
