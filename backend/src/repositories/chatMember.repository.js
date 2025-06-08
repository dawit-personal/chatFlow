const { ChatMember,  UserProfile, Chat, User } = require('../../db/models');

const { Op } = require('sequelize');
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

  async findAllChatMembers(where = {}, attributes = null, options = {}) {
    const { offset = 0, limit = 10, order = [['joinedAt', 'DESC']] } = options;
    return await ChatMember.findAll({
      where,
      attributes: attributes || undefined,
      offset,
      limit,
      order,
      raw: true,
    });
  }

  async findAllChatMembersByName({ userId, chatIds, offset = 0, limit = 10 }) {

    if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
      // If no chatIds provided, return empty array early
      return [];
    }
    
    return await ChatMember.findAll({
      where: {
        userId: { [Op.ne]: userId },  // exclude current user
        chatId: { [Op.in]: chatIds }, // accept array of chatIds
      },
      include: [
        {
          model: User,
          as: 'user',  // matches ChatMember association alias
          include: [
            {
              model: UserProfile,
              as: 'profile', // matches UserProfile association alias
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
      ],
      offset,
      limit,
      order: [['joinedAt', 'DESC']],
    });
  }

}


module.exports = new ChatMemberRepository();
