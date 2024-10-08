const Channel = require('../models/Channel');

exports.getChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find();
    res.status(200).json({ status: true, data: channels });
  } catch (err) {
    next(err);
  }
};

exports.addChannel = async (req, res, next) => {
  try {
    const { name, url } = req.body;
    const channel = await Channel.create({ user: req.user.id,username:req.user.name,image:req.user.image, name, url });
    res.status(201).json({ status: true, data: channel });
  } catch (err) {
    next(err);
  }
};

exports.updateChannel = async (req, res, next) => {
  try {
    let channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ status: false, error: 'Channel not found' });
    }

    if (channel.user.toString() !== req.user.id) {
      return res.status(401).json({ status: false, error: 'Not authorized to update this channel' });
    }

    channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: true, data: channel });
  } catch (err) {
    next(err);
  }
};

exports.deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ status: false, error: 'Channel not found' });
    }

    if (channel.user.toString() !== req.user.id) {
      return res.status(401).json({ status: false, error: 'Not authorized to delete this channel' });
    }
  await channel.remove();

    res.status(200).json({ status: true, data: {} });
  } catch (err) {
    next(err);
  }
};