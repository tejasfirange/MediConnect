const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: "sunbeaminternship@gmail.com",
    pass: "acfc yejg qgsl qmxg"
  },
  // Force IPv4 to avoid ENETUNREACH on some cloud network environments
  family: 4 
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