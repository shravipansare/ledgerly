import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import clientRoutes from "./routes/client.routes";
import productRoutes from "./routes/product.routes";
import invoiceRoutes from "./routes/invoice.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import reportRoutes from "./routes/report.routes";
import quotationRoutes from "./routes/quotation.routes";
import expenseRoutes from "./routes/expense.routes";
import taxRoutes from "./routes/tax.routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/taxes", taxRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Ledgerly API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
