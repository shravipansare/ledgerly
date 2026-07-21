const axios = require('axios');

async function test() {
  try {
    // First, login to get token
    const loginRes = await axios.post("http://localhost:5000/api/users/login", {
      email: "demo@example.com", // Assume a user exists or I can fetch one from DB
      password: "password" 
    });
    // This is hard, I don't know the user password. 
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
