const { Chats } = require('../../db/models');

class ChatsRepository {
  async createChats(data) {
    return await Chats.create(data);
  }

  async getChatsById(id) {
    return await Chats.findByPk(id);
  }

  async getAllChatss() {
    return await Chats.findAll();
  }

  async updateChats(id, updates) {
    const item = await Chats.findByPk(id);
    if (!item) return null;
    return await item.update(updates);
  }

  async deleteChats(id) {
    return await Chats.destroy({ where: { id } });
  }

  async countChatss() {
    return await Chats.count();
  }

  async findChats(where = {}, attributes = null) {
    return await Chats.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }
}

module.exports = new ChatsRepository();
