async function main() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "shravanipansare80@gmail.com" })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

main();
