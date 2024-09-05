const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');
const authService = require('../services/authService');
const AWS = require('aws-sdk');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');

// exports.registerUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if name (formerly username) is provided
//     if (!name) {
//       return res.status(400).json({ status: false, message: 'Name is required' });
//     }

//     // Check if email already exists
//     const dbUser =  await User.findOne({ email: email });
//     if (dbUser) {
//       return res.status(400).json({ status: false, message: 'Email already exists!' });
//     }

//     const user = await User.create({ name, email, password });

//     const token = generateToken(user.id);

//     res.status(200).json({
//       status: true,
//       message: "User created successfully.",
//       data: { name: user.name, email: user.email, token },
//     });
//   } catch (err) {
//     if (err.code === 11000) {
//       console.log('Request body:', req.body);


//       return res.status(400).json({ status: false, message: 'Duplicate field value entered' });
//     }
//     next(err);
//   }
// };


// Configure AWS S3 (or your preferred storage service)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });



exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ status: false, message: 'Name is required' });
    }

    // Check if email already exists
    const dbUser = await User.findOne({ email: email });
    if (dbUser) {
      return res.status(400).json({ status: false, message: 'Email already exists!' });
    }


    let imageUrl = null;

    // Upload image to S3 if a file is provided
    if (req.file) {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${path.basename(req.file.originalname)}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      };

      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location; // URL of the uploaded image
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
console.log('Hashed Password:', hashedPassword);
    // Create user with hashed password
    const user = await User.create({ name, email, password: hashedPassword, image: imageUrl });
console.log('Stored Hashed Password:', user.password);
    const token = generateToken(user.id);

    res.status(200).json({
      status: true,
      message: "User created successfully.",
      data: { name: user.name, email: user.email, image: user.image, token },
    });
  } catch (err) {
    if (err.code === 11000) {
      console.log('Request body:', req.body);
      return res.status(400).json({ status: false, message: 'Duplicate field value entered' });
    }
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Request Body:', req.body);

  if (!email || !password) {
    return res.status(400).json({ status: false, message: 'Please provide email and password' });
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    console.log('Retrieved User:', user);
    console.log('Stored Hashed Password:', user.password);
    if (!user) {
      return res.status(200).json({ status: false, message: 'User Not Found!' });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ status: false, message: 'Wrong Password!' });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      status: true,
      message: "User logged in successfully.",
      data: { name: user.name,image:user.image, email: user.email, token },
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: 'There is no user with that email' });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ status: true, message: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ status: false, message: 'Email could not be sent' });
    }
  } catch (err) {
    next(err);
  }
};
