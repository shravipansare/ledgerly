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
  const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
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
