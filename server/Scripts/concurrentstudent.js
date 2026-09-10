const concurrentRequests = 50;

console.log(`🚀 Sending ${concurrentRequests} concurrent student requests...\n`);

const startAll = performance.now();

const requests = Array.from(
    { length: concurrentRequests },
    async (_, index) => {

        // Use different synthetic students
        const studentNumber = index + 1;

        const email = `student${studentNumber}@performance.test`;

        try {
            // Login
            const loginResponse = await fetch(
                "http://127.0.0.1:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password: "Test@123"
                    })
                }
            );

            if (loginResponse.status !== 200) {
                return {
                    success: false,
                    time: performance.now() - startAll
                };
            }

            const loginData = await loginResponse.json();
            const token = loginData.token;

            // Request student's dissertation
            const start = performance.now();

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

            const time = performance.now() - start;

            return {
                success: response.ok && Array.isArray(data),
                records: Array.isArray(data) ? data.length : 0,
                time
            };

        } catch (error) {
            return {
                success: false,
                records: 0,
                time: 0
            };
        }
    }
);

const results = await Promise.all(requests);

const totalTime = performance.now() - startAll;

const successful = results.filter(
    result => result.success
).length;

const failed = results.length - successful;

const successfulTimes = results
    .filter(result => result.success)
    .map(result => result.time)
    .sort((a, b) => a - b);

const average =
    successfulTimes.reduce(
        (sum, time) => sum + time,
        0
    ) / successfulTimes.length;

const p95 =
    successfulTimes[
        Math.ceil(successfulTimes.length * 0.95) - 1
    ];

console.log("==============================");
console.log(" CONCURRENT STUDENT RESULTS");
console.log("==============================");

console.log(`Concurrent Requests : ${concurrentRequests}`);
console.log(`Successful          : ${successful}`);
console.log(`Failed              : ${failed}`);
console.log(`Average             : ${average.toFixed(2)} ms`);
console.log(`P95                 : ${p95.toFixed(2)} ms`);
console.log(
    `Minimum             : ${successfulTimes[0].toFixed(2)} ms`
);
console.log(
    `Maximum             : ${
        successfulTimes[successfulTimes.length - 1].toFixed(2)
    } ms`
);
console.log(`Total Batch Time    : ${totalTime.toFixed(2)} ms`);