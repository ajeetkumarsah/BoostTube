
const jwt = require('../utils/jwt');
const User = require('../models/User');

class AuthService {
  async register(userData) {
    const { username, email, password } = userData;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }




    // Create new user
    const newUser = new User({
      username,
      email,
      password: password,
    });

    await newUser.save();
    return newUser;
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = password=== user.password;
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.generateToken(user._id);
    return { user, token };
  }

  async resetPassword(userId, newPassword) {

    const user = await User.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
