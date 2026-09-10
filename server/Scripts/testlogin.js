const totalRequests = 50;
const times = [];
let success = 0;
let failed = 0;

for (let i = 0; i < totalRequests; i++) {
    const start = performance.now();

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "student1@performance.test",
                password: "Test@123"
            })
        });

        await response.text();

        const end = performance.now();
        times.push(end - start);

        if (response.status === 200) {
            success++;
        } else {
            failed++;
        }
    } catch (error) {
        failed++;
    }
}

times.sort((a, b) => a - b);

const average =
    times.reduce((sum, time) => sum + time, 0) / times.length;

const min = times[0];
const max = times[times.length - 1];

const p95Index = Math.ceil(times.length * 0.95) - 1;
const p95 = times[p95Index];

console.log("\n========== LOGIN PERFORMANCE ==========");
console.log("Total requests :", totalRequests);
console.log("Successful     :", success);
console.log("Failed         :", failed);
console.log("Min            :", min.toFixed(2), "ms");
console.log("Average        :", average.toFixed(2), "ms");
console.log("p95            :", p95.toFixed(2), "ms");
console.log("Max            :", max.toFixed(2), "ms");
console.log("=======================================");