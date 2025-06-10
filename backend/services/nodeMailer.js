const nodemailer = require("nodemailer");
const fs = require('fs');

const htmlContent = fs.readFileSync('./config/Comment.html', 'utf8');
const htmlPostContent = fs.readFileSync('./config/Post.html', 'utf8');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "snehlata0042@gmail.com",
    // pass: "Sgsatyam@01",
    pass: "bnxsswqdwcotrsyy"
  },
});

const newcomment  = async(email) => {
  console.log('inside newComment function');
  console.log(email);
  if (!email) {
      console.error('Invalid comment data: user email is missing');
      return;
  }
  try {
      const info = await transporter.sendMail({
          from: 'snehlata0042@gmail.com',
          to: email, 
          subject: "New Comment Notification",
          text: "A new comment has been posted.",
          // html: "<b>A new comment has been posted.</b>",
          html: htmlContent,
      });

      console.log("Message sent:", info.messageId);
  } catch (error) {
      console.error('Error sending email:', error);
  }
}

const newPost  = async(email) => {
  console.log('inside newPost function');
  console.log(email);
  if (!email) {
      console.error('Invalid comment data: user email is missing');
      return;
  }
  try {
      const info = await transporter.sendMail({
          from: 'snehlata0042@gmail.com',
          to: email, 
          subject: "New Post Notification",
          text: "A new Post has been posted.",
          html: htmlPostContent,
      });

      console.log("Message sent:", info.messageId);
  } catch (error) {
      console.error('Error sending email:', error);
  }
}

newcomment().catch(console.error);

module.exports = { newcomment, newPost }; 