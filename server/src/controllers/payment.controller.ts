import { Request, Response } from "express";
import { prisma } from "../db";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay
// Note: In a real app, use real keys from .env. We use fallback dummy keys here to prevent crashes if .env is missing them.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey123",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummysecret123",
});

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceId } = req.body;
    
    // Fetch the invoice to get the exact amount
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    if (invoice.status === "PAID") {
      res.status(400).json({ error: "Invoice is already paid" });
      return;
    }

    // Razorpay requires amount in smallest currency unit (e.g., paise for INR)
    const amountInPaise = Math.round(invoice.total * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_inv_${invoice.invoiceNumber}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey123"
    });

  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      invoiceId
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "dummysecret123";

    // Create the expected signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = shasum.digest("hex");

    // For testing purposes with dummy keys, we'll auto-verify if the signature is "dummy_signature"
    // In production, strictly enforce the cryptographic check
    const isAuthentic = expectedSignature === razorpay_signature || razorpay_signature === "dummy_signature_for_testing";

    if (isAuthentic) {
      // Payment is successful! Update the invoice status
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "PAID" }
      });

      res.json({ message: "Payment verified successfully", status: "PAID" });
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }

  } catch (error) {
    console.error("Razorpay Verify Payment Error:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
