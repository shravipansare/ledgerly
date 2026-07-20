import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendInvoiceEmailParams {
  to: string;
  clientName: string;
  invoiceNumber: string;
  totalAmount: number;
  pdfBase64: string;
}

export const sendInvoiceEmailService = async (params: SendInvoiceEmailParams): Promise<void> => {
  const { to, clientName, invoiceNumber, totalAmount, pdfBase64 } = params;

  // Convert base64 string to buffer (strip data URI prefix if it exists)
  // pdf.output("datauristring") sometimes includes filename in the prefix, so split(',') is much safer.
  const base64Data = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
  const pdfBuffer = Buffer.from(base64Data, "base64");

  const mailOptions = {
    from: `"MartechAdda Billing" <${process.env.SMTP_FROM}>`,
    to,
    subject: `Invoice No. ${invoiceNumber} from MartechAdda`,
    text: `Hello ${clientName},\n\nPlease find your invoice No. ${invoiceNumber} for the total amount of $${totalAmount.toFixed(2)} attached to this email.\n\nThank you for your business!\n\nBest regards,\nMartechAdda`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #0f172a;">Invoice No. ${invoiceNumber}</h2>
        <p>Hello <strong>${clientName}</strong>,</p>
        <p>Please find your invoice for the total amount of <strong>$${totalAmount.toFixed(2)}</strong> attached to this email as a PDF.</p>
        <p>Thank you for your business!</p>
        <br/>
        <p style="font-size: 0.875rem; color: #64748b;">Best regards,<br/>MartechAdda Billing Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `Invoice-${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    throw error;
  }
};

interface SendQuotationEmailParams {
  to: string;
  clientName: string;
  quotationNumber: string;
  totalAmount: number;
  pdfBase64: string;
}

export const sendQuotationEmailService = async (params: SendQuotationEmailParams): Promise<void> => {
  const { to, clientName, quotationNumber, totalAmount, pdfBase64 } = params;

  const base64Data = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
  const pdfBuffer = Buffer.from(base64Data, "base64");

  const mailOptions = {
    from: `"MartechAdda Billing" <${process.env.SMTP_FROM}>`,
    to,
    subject: `Quotation No. ${quotationNumber} from MartechAdda`,
    text: `Hello ${clientName},\n\nPlease find your quotation No. ${quotationNumber} for the total amount of ₹${totalAmount.toFixed(2)} attached to this email.\n\nThank you for your business!\n\nBest regards,\nMartechAdda`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #0f172a;">Quotation No. ${quotationNumber}</h2>
        <p>Hello <strong>${clientName}</strong>,</p>
        <p>Please find your quotation for the total amount of <strong>₹${totalAmount.toFixed(2)}</strong> attached to this email as a PDF.</p>
        <p>Thank you for considering our services!</p>
        <br/>
        <p style="font-size: 0.875rem; color: #64748b;">Best regards,<br/>MartechAdda Billing Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `Quotation-${quotationNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending quotation email via Nodemailer:", error);
    throw error;
  }
};

interface SendPasswordResetParams {
  to: string;
  userName: string;
  resetLink: string;
}

export const sendPasswordResetEmailService = async (params: SendPasswordResetParams): Promise<void> => {
  const { to, userName, resetLink } = params;

  const mailOptions = {
    from: `"MartechAdda Accounts" <${process.env.SMTP_FROM}>`,
    to,
    subject: `Reset your MartechAdda Password`,
    text: `Hello ${userName},\n\nYou requested to reset your password. Please click the following link to choose a new password:\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nMartechAdda`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #0f172a;">Password Reset Request</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>You recently requested to reset your password for your MartechAdda account. Click the button below to reset it:</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 0.875rem;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
        <br/>
        <p style="font-size: 0.875rem; color: #64748b;">Best regards,<br/>MartechAdda Accounts Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
