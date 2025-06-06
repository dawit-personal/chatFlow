const { Chat } = require('../../db/models');

class ChatsRepository {
  async createChats(data) {
    return await Chat.create(data);
  }

  async getChatsById(id) {
    return await Chat.findByPk(id);
  }

  async getAllChatss() {
    return await Chat.findAll();
  }

  async updateChats(id, updates) {
    const item = await Chat.findByPk(id);
    if (!item) return null;
    return await item.update(updates);
  }

  async deleteChats(id) {
    return await Chat.destroy({ where: { id } });
  }

  async countChatss() {
    return await Chat.count();
  }

  async findChats(where = {}, attributes = null) {
    return await Chat.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }
}

module.exports = new ChatsRepository();
