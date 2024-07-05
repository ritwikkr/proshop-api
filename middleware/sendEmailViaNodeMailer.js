import nodemailer from "nodemailer";

async function sendEmail(to, subject, text, html) {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASSWORD,
      },
    });

    // Define the email options
    let mailOptions = {
      from: "myproshop.testing@gmail.com",
      to,
      subject,
      text,
      html,
    };
    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export default sendEmail;
