const nodemailer = require("nodemailer");
require("dotenv").config()

const sendEmail = async (option)=>{
// creating a transporter
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });
  
  // verifying the transporter
  transporter.verify((error, success) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Ready for message");
      console.log(success);
    }
  });

  const mailOption = {
    from: process.env.AUTH_EMAIL,
    to: option.email,
    subject: option.subject,
    html: option.html
  };

  await transporter.sendMail(mailOption)

}

module.exports = {sendEmail}