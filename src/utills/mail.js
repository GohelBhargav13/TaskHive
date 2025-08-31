import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: process.env.APP_BASE_URL, // Use base URL from environment
    },
  });

  // Generate both plain-text and HTML email formats
  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailTextHTML = mailGenerator.generate(options.mailgenContent);

  // Configure provider (Gmail SMTP)
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  });

  // Email object
  const mail = {
    from: process.env.EMAIL_SENDER || "noreply@yourapp.com", // Use environment or default sender
    to: options.email,
    subject: options.subject,
    text: emailText, // plain-text body
    html: emailTextHTML,
  };

  try {
    await transport.sendMail(mail);
    console.log("Mail Sent...");
  } catch (error) {
    console.error("Email Failed", error);
  }
};

// Generates Mailgen body with button
const emailVerificationMailGenContent = (username, verificationURL) => {
  return {
    body: {
      name: username,
      intro: `
      Welcome to App! Please verify your email:<br><br>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td bgcolor="#22BC66" style="border-radius:2px;">
                  <a href="${process.env.APP_BASE_URL}/v1/api/verify/${verificationURL}"
                     target="_blank"
                     style="padding:10px 20px; border:1px solid #22BC66; border-radius:2px; font-family:Helvetica,Arial,sans-serif; font-size:16px; color:#ffffff; text-decoration:none; font-weight:bold; display:inline-block;">
                     Verify Your Email
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      `,
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { sendMail, emailVerificationMailGenContent };
