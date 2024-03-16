const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `Chat <Chat@gmail.com>`,
    to: option.email,
    subject: option.subject,
    text: option.message,
  });
};

module.exports = sendEmail;
