const userService = require('../services/userService');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const user = await userService.getUsers();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUsers({user:req.user.id});
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
