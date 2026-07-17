const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/Dashboard.tsx',
  'src/pages/Expenses.tsx',
  'src/pages/InvoiceDetails.tsx',
  'src/pages/Products.tsx',
  'src/pages/Reports.tsx',
  'src/pages/CreateInvoice.tsx',
  'src/pages/Invoices.tsx'
];

for (const relPath of filesToUpdate) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Specific literal string replacements
  content = content.replace(/tickFormatter=\{\(value\) => `\$(\{value\})`\}/g, "tickFormatter={(value) => `₹${value}`}");
  content = content.replace(/\$(\{item\.unitPrice\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{item\.total\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{invoice\.subtotal\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{invoice\.taxTotal\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{invoice\.total\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{subtotal\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{taxTotal\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{total\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{expense\.amount\.toFixed\(2\)\})/g, "₹$1");
  content = content.replace(/\$(\{product\.price\.toFixed\(2\)\})/g, "₹$1");
  
  // Specific Label replacements
  content = content.replace(/Amount \(\$\)/g, "Amount (₹)");
  content = content.replace(/Price \(\$\)/g, "Price (₹)");

  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log("Safe replacement complete.");
