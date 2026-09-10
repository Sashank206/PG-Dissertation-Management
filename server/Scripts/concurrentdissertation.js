const concurrentRequests = 500;

// Login first
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

if (loginResponse.status !== 200) {
    console.log("Login failed:", loginData);
    process.exit(1);
}

const token = loginData.token;

console.log(`🚀 Sending ${concurrentRequests} concurrent requests...\n`);

const startAll = performance.now();

const requests = Array.from(
    { length: concurrentRequests },
    async () => {
        const start = performance.now();

        try {
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

            return {
                success: response.ok && Array.isArray(data),
                records: Array.isArray(data) ? data.length : 0,
                time: performance.now() - start
            };
        } catch (error) {
            return {
                success: false,
                records: 0,
                time: performance.now() - start
            };
        }
    }
);

const results = await Promise.all(requests);

const totalTime = performance.now() - startAll;

const times = results
    .map(r => r.time)
    .sort((a, b) => a - b);

const successful = results.filter(r => r.success).length;
const failed = results.length - successful;

const average =
    times.reduce((sum, time) => sum + time, 0) / times.length;

const p95 =
    times[Math.ceil(times.length * 0.95) - 1];

console.log("==============================");
console.log(" CONCURRENT TEST RESULTS");
console.log("==============================");

console.log(`Concurrent Requests : ${concurrentRequests}`);
console.log(`Successful          : ${successful}`);
console.log(`Failed              : ${failed}`);
console.log(`Average             : ${average.toFixed(2)} ms`);
console.log(`P95                 : ${p95.toFixed(2)} ms`);
console.log(`Minimum             : ${times[0].toFixed(2)} ms`);
console.log(`Maximum             : ${times[times.length - 1].toFixed(2)} ms`);
console.log(`Total Batch Time    : ${totalTime.toFixed(2)} ms`);