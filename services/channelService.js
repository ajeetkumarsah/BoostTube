const Channel = require('../models/Channel');

class ChannelService {
  async addChannel(userId, channelData) {
    const { channelUrl } = channelData;

    const newChannel = new Channel({
      userId,
      channelUrl,
      viewsEarned: 0,
    });

    await newChannel.save();
    return newChannel;
  }

  async getChannelsByUser(userId) {
    const channels = await Channel.find({ userId });
    return channels;
  }

  async updateChannel(channelId, updateData) {
    const channel = await Channel.findByIdAndUpdate(channelId, updateData, { new: true });
    if (!channel) {
      throw new Error('Channel not found');
    }
    return channel;
  }

  async deleteChannel(channelId) {
    const channel = await Channel.findByIdAndDelete(channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }
    return channel;
  }

  async promoteChannel(channelId, viewsToAdd) {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }

    channel.viewsEarned += viewsToAdd;
    await channel.save();
    return channel;
  }
}

module.exports = new ChannelService();
