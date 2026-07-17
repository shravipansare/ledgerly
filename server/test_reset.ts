async function main() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "shravanipansare80@mail.com" })
    });
    const data = await res.json();
    console.log("Response:", res.status, data);
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

main();
