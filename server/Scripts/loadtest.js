const concurrentUsers = 1000;

const requests = [];

for (let i = 0; i < concurrentUsers; i++) {
    requests.push(
        (async () => {
            const start = performance.now();

            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/api/auth/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: `student${(i % 500) + 1}@performance.test`,
                            password: "Test@123"
                        })
                    }
                );

                const responseText = await response.text();
                const end = performance.now();

                return {
                    status: response.status,
                    time: end - start,
                    error: null,
                    response: responseText
                };

            } catch (error) {
                const end = performance.now();

                return {
                    status: 0,
                    time: end - start,
                    error: error.message,
                    response: null
                };
            }
        })()
    );
}

const results = await Promise.all(requests);

const successful = results.filter(r => r.status === 200);
const httpErrors = results.filter(
    r => r.status !== 0 && r.status !== 200
);
const connectionErrors = results.filter(
    r => r.status === 0
);

const times = successful
    .map(r => r.time)
    .sort((a, b) => a - b);

console.log("\n========== 1000 REQUEST DIAGNOSTIC ==========");

console.log("Total requests    :", results.length);
console.log("Successful        :", successful.length);
console.log("HTTP errors       :", httpErrors.length);
console.log("Connection errors :", connectionErrors.length);

if (times.length > 0) {
    const average =
        times.reduce((sum, time) => sum + time, 0) / times.length;

    const p95Index = Math.ceil(times.length * 0.95) - 1;

    console.log("Min               :", times[0].toFixed(2), "ms");
    console.log("Average           :", average.toFixed(2), "ms");
    console.log("p95               :", times[p95Index].toFixed(2), "ms");
    console.log(
        "Max               :",
        times[times.length - 1].toFixed(2),
        "ms"
    );
}

console.log("\nHTTP error breakdown:");

const httpStatusCounts = {};

for (const result of httpErrors) {
    httpStatusCounts[result.status] =
        (httpStatusCounts[result.status] || 0) + 1;
}

console.log(httpStatusCounts);

console.log("\nConnection error breakdown:");

const connectionErrorCounts = {};

for (const result of connectionErrors) {
    const error = result.error || "Unknown error";

    connectionErrorCounts[error] =
        (connectionErrorCounts[error] || 0) + 1;
}

console.log(connectionErrorCounts);

console.log("==============================================");