import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://mailgen.js/",
    },
  });
  var emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  var emailTextHTML = mailGenerator.generate(options.mailgenContent);

  // Looking to send emails in production? Check out our Email API/SMTP product!
  var transport = nodemailer.createTransport({
    host: process.env.MAIL_HOSTNAME,
    port: process.env.MAIL_PORT,
    secure:false,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  });

  const mail = {
    from: 'gohelbhargavdev@example.com',
    to: options.email,
    subject: options.subject,
    text:emailText, // plain‑text body
    html: emailTextHTML,
  }

  try {
    await transport.sendMail(mail)
    console.log("Mail Sent...");
  } catch (error) {
    console.error("Email Failed", error);
  }
};

const emailVerificationMailGenContent = (username, verificationURL) => {
  return {
    body: {
      name: username,
      intro: "Welcome to App! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Our App, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify Your Email",
          link: `${process.env.APP_BASE_URL}/v1/api/verify/${verificationURL}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { sendMail, emailVerificationMailGenContent };
