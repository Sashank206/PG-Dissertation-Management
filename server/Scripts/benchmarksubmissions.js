const times = [];

let success = 0;
let failed = 0;

// Login as student
const loginResponse = await fetch(
    "http://127.0.0.1:5000/api/auth/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: "student1@performance.test",
            password: "Test@123"
        })
    }
);

const loginData = await loginResponse.json();

if (loginResponse.status !== 200) {
    console.log("Login failed:", loginData);
    process.exit(1);
}

const token = loginData.token;

console.log("✅ Login successful");
console.log("🚀 Starting 50 submission API requests...\n");

// 50 sequential requests
for (let i = 0; i < 50; i++) {

    const start = performance.now();

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/submissions",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        const end = performance.now();
        const time = end - start;

        times.push(time);

        if (response.ok && Array.isArray(data)) {
            success++;
        } else {
            failed++;
        }

        console.log(
            `Request ${i + 1}: ${time.toFixed(2)} ms | Records: ${
                Array.isArray(data) ? data.length : 0
            }`
        );

    } catch (error) {
        failed++;
        console.log(`Request ${i + 1}: ERROR`);
    }
}

times.sort((a, b) => a - b);

const average =
    times.reduce((sum, time) => sum + time, 0) / times.length;

const p95 =
    times[Math.ceil(times.length * 0.95) - 1];

console.log("\n==============================");
console.log(" SUBMISSIONS BENCHMARK RESULTS");
console.log("==============================");

console.log(`Total Requests : ${times.length}`);
console.log(`Successful     : ${success}`);
console.log(`Failed         : ${failed}`);
console.log(`Average        : ${average.toFixed(2)} ms`);
console.log(`P95            : ${p95.toFixed(2)} ms`);
console.log(`Minimum        : ${times[0].toFixed(2)} ms`);
console.log(`Maximum        : ${times[times.length - 1].toFixed(2)} ms`);