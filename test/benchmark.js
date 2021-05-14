import { Base32 as B } from "../dist/base32.js";
(() => {
    const benchmarkCount = 1000000;
    let _sT = 0;
    const bStart = (text) => {
        console.log("\u001b[43;30m >>>>> " + text + " \u001b[0m");
        _sT = performance.now();
    }
    const bEnd = () => {
        let endT = performance.now();
        console.log(" \u001b[42m🕒 \u001b[0m\u001b[32m " + benchmarkCount + " count\u001b[0m",
            "\u001b[90m" + (endT - _sT).toPrecision(4) + "ms\u001b[0m ", Math.round(benchmarkCount / (endT - _sT) * 1000 * 1000) / 1000 + " per second.\n");
    }
    try {

        const b32 = new B();
        const clkw = new B({ variant: 'clockwork' });
        const crf = new B({ variant: 'crockford' });
        const b32_arr = new B({ 'array': true });
        const crf_arr = new B({ variant: 'crockford', 'array': true });
        const rnd = () => { return Math.random().toString(16) }

        bStart('base32.encode');
        for (let i = 0; i < benchmarkCount; i++) {
            b32.encode(rnd());
        }
        bEnd();
        bStart('base32.encode -> decode');
        for (let i = 0; i < benchmarkCount; i++) {
            b32.decode(b32.encode(rnd()));
        }
        bEnd();

        bStart('base32_clockwork.encode');
        for (let i = 0; i < benchmarkCount; i++) {
            clkw.encode(rnd());
        }
        bEnd();
        bStart('base32_clockwork.encode -> decode');
        for (let i = 0; i < benchmarkCount; i++) {
            clkw.decode(clkw.encode(rnd()));
        }
        bEnd();

        bStart('base32_crockford.encode');
        for (let i = 0; i < benchmarkCount; i++) {
            crf.encode(i);
        }
        bEnd();
        bStart('base32_crockford.encode -> decode');
        for (let i = 0; i < benchmarkCount; i++) {
            crf.decode(crf.encode(i));
        }
        bEnd();

        bStart('base32_arr.encode');
        for (let i = 0; i < benchmarkCount; i++) {
            b32_arr.encode(rnd());
        }
        bEnd();
        bStart('base32.encode -> base32_arr.decode');
        for (let i = 0; i < benchmarkCount; i++) {
            b32_arr.decode(b32.encode(rnd()));
        }
        bEnd();

        bStart('base32_crockford_arr.encode');
        for (let i = 0; i < benchmarkCount; i++) {
            crf_arr.encode(i ^ 2);
        }
        bEnd();
        bStart('base32_crockford.encode -> decode');
        for (let i = 0; i < benchmarkCount; i++) {
            crf_arr.decode(crf.encode(i ^ 2));
        }
        bEnd();


    } catch (e) {
        console.error("\u001b[41m -> \u001b[0m", e);
        process.exit(1);
    }

    console.log("\u001b[32mDone.\u001b[0m\n");
})();

