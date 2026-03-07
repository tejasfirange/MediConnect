const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // Using hardcoded IPv4 for smtp.gmail.com to bypass Render's IPv6 resolution issues
  host: "142.250.141.108", 
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: "sunbeaminternship@gmail.com",
    pass: "acfc yejg qgsl qmxg"
  },
  tls: {
    // Required to match the certificate to the domain when using IP as host
    servername: "smtp.gmail.com"
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