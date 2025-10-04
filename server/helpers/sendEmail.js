const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,     // your gmail
      pass: process.env.EMAIL_PASS      // app password (not actual pwd)
    }
  });

  const mailOptions = {
    from: `"BBSBEC ALUMNI PORTAL" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
