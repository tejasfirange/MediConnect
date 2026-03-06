const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sunbeaminternship@gmail.com",
    pass: "acfc yejg qgsl qmxg"
  }
});

async function sendResetEmail(email, link) {

  await transporter.sendMail({
    from: "MediConnect",
    to: email,
    subject: "Password Reset",
    text: `Reset your password here: ${link}`
  });

}

module.exports = sendResetEmail;