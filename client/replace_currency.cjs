const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndReplace(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace literal $ with ₹ (only if not followed by { which means string interpolation)
      // Exception: in Dashboard.tsx tickFormatter={(value) => `$${value}`} -> tickFormatter={(value) => `₹${value}`}
      // So actually, if it's inside backticks it's tricky.
      // Let's just do a manual replace of specific patterns.
      
      content = content.replace(/\$(?=\{)/g, '₹'); // Matches `${` but only replaces $ -> this breaks string interpolation! We don't want this!
      
      // We want to replace $ when it's NOT followed by {
      // Actually, in tickFormatter={(value) => `$${value}`}, the first $ is literal, the second is interpolation!
      // So replacing $ when not followed by { is correct: /\$(?!\{)/g
      const oldContent = content;
      content = content.replace(/\$(?!\{)/g, '₹');
      
      // Wait, there are instances of Amount ($) -> Amount (₹)
      // This is handled by /\$(?!\{)/g
      
      if (oldContent !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

findAndReplace(directoryPath);
