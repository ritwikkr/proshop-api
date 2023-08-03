import nodemailer from "nodemailer";

const sendPasswordResetEmail = async (recipient, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ritwikumarishu@gmail.com",
        pass: "Gmail@#2119",
      },
    });

    const mailOptions = {
      from: "ritwikumarishu@gmail.com",
      to: recipient,
      subject: "Forgot Password",
      text: `Forgot Password Link \n ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendPasswordResetEmail;
