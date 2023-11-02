import AWS from "aws-sdk";
import dotenv from "dotenv";

// Embedding .env file
dotenv.config();

const SES_CONFIG = {
  accessKeyId: process.env.AWS_CLIENT_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-south-1",
};

const AWS_SES = new AWS.SES(SES_CONFIG);

async function sendMail(recipientEmail, message) {
  const params = {
    Source: process.env.SENDER_EMAIL_ADDRESS,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>Hello,</p><p>We have received your request to reset the password. Click the below link to set a new password.</p><p>${message}</p><p>Note that the link will expire in 24 hours, so be sure to use it right away.</p><p>Warm Regards</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Hello,\n\nWe have received your request to reset the password. Click the below link to set a new password.\n\n${message}\n\nNote that the link will expire in 24 hours, so be sure to use it right away.\n\nWarm Regards`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Proshop Account - Reset Password Link`,
      },
    },
  };

  try {
    await AWS_SES.sendEmail(params).promise();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default sendMail;
