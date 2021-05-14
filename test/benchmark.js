import { Base32 } from "../dist/base32.js";
(() => {
    let _logTime = 0;
    const logTitle = (text) => {
        console.log("\u001b[43;30m >>>>> " + text + " \u001b[0m");
        _logTime = performance.now();
    }
    const benchmark = (count) => {
        let endtime = performance.now();
        console.log(" \u001b[42m🕒 \u001b[0m\u001b[32m " + count + " count\u001b[0m",
            "\u001b[90m" + (endtime - _logTime).toPrecision(4) + "ms\u001b[0m ", Math.round(count / (endtime - _logTime) * 1000 * 1000) / 1000 + " per second.\n");
    }
    try {

        const base32 = new Base32();
        const base32_clockwork = new Base32({ variant: 'clockwork' });
        const base32_crockford = new Base32({ variant: 'crockford' });
        const base32_arr = new Base32({ 'array': true });
        const base32_crockford_arr = new Base32({ variant: 'crockford', 'array': true });


        const benchmarkCount= 1000000;
        logTitle('Benchmark:base32.encode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32.encode(Math.random().toString(32).substring(2));            
        }
        benchmark(benchmarkCount);
        logTitle('Benchmark:base32.encode -> decode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32.decode(base32.encode(Math.random().toString(32).substring(2)));            
        }
        benchmark(benchmarkCount);

        logTitle('Benchmark:base32_clockwork.encode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32_clockwork.encode(Math.random().toString(32).substring(2));            
        }
        benchmark(benchmarkCount);
        logTitle('Benchmark:base32_clockwork.encode -> decode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32_clockwork.decode(base32_clockwork.encode(Math.random().toString(32).substring(2)));            
        }
        benchmark(benchmarkCount);

        logTitle('Benchmark:base32_crockford.encode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32_crockford.encode(index);            
        }
        benchmark(benchmarkCount);
        logTitle('Benchmark:base32_crockford.encode -> decode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32_crockford.decode(base32_crockford.encode(index));            
        }
        benchmark(benchmarkCount);

        logTitle('Benchmark:base32_arr.encode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32_arr.encode(Math.random().toString(32).substring(2));            
        }
        benchmark(benchmarkCount);
        logTitle('Benchmark:base32.encode -> base32_arr.decode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32_arr.decode(base32.encode(Math.random().toString(32).substring(2)));            
        }
        benchmark(benchmarkCount);

        logTitle('Benchmark:base32_crockford_arr.encode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32_crockford_arr.encode(index^2);            
        }
        benchmark(benchmarkCount);
        logTitle('Benchmark:base32_crockford.encode -> decode');
        for (let index = 0; index < benchmarkCount; index++) {
            base32_crockford_arr.decode(base32_crockford.encode(index^2));
        }
        benchmark(benchmarkCount);


    } catch (e) {
        console.error("\u001b[41m -> \u001b[0m", e);
        process.exit(1);
    }

    console.log("\u001b[32mDone.\u001b[0m\n");
})();

