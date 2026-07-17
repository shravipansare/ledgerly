const nodemailer = require("nodemailer");

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.martechadda.com",
    port: 465,
    secure: true,
    auth: {
      user: "crm.test@martechadda.com",
      pass: "Xr540e502",
    },
  });

  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("Connection verified!");

    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: '"Test" <crm.test@martechadda.com>',
      to: "crm.test@martechadda.com", // Send to self as a test
      subject: "Test Email",
      text: "This is a test email.",
    });
    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("Error during email test:", error);
  }
}

testEmail();
