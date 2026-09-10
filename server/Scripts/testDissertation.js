const loginResponse = await fetch(
    "http://127.0.0.1:5000/api/auth/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: "admin1@performance.test",
            password: "Test@123"
        })
    }
);

const loginData = await loginResponse.json();

console.log("Login status:", loginResponse.status);

if (loginResponse.status !== 200) {
    console.log("Login failed:", loginData);
    process.exit(1);
}

const token = loginData.token;

console.log("✅ Login successful");
console.log("🔑 Token received");

const response = await fetch(
    "http://127.0.0.1:5000/api/dissertations",
    {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

const data = await response.json();

console.log("Dissertation API status:", response.status);

if (Array.isArray(data)) {
    console.log("Records returned:", data.length);
} else {
    console.log("Response:", data);
}