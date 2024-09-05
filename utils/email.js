const nodemailer = require('nodemailer');
const config = require('../config/index');

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  const message = {
    from: `${config.FROM_NAME} <${config.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};
