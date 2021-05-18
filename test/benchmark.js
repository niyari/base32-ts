import { Base32 as B } from "../dist/base32.js";
(() => {
    const bCount = 1000000;
    let _sT = 0;
    const bStart = (text) => {
        console.log("\u001b[43;30m >>>>> " + text + " \u001b[0m");
        _sT = performance.now();
    }
    const bEnd = () => {
        let endT = performance.now();
        console.log("\u001b[32m " + bCount + " requests\u001b[0m",
            "\u001b[90m" + (endT - _sT).toPrecision(4) + " ms\u001b[0m",
            Math.round(bCount / (endT - _sT) * 1000 * 1000) / 1000 + " per second.\n",
            'Time per request: ' + (endT - _sT) / bCount + " ms.\n");
    }
    try {

        const b32 = new B();
        const clkw = new B({ variant: 'clockwork' });
        const crf = new B({ variant: 'crockford' });
        const crf_c = new B({ variant: 'crockford', checksum: true });
        const b32_arr = new B({ 'array': true });
        const crf_arr = new B({ variant: 'crockford', 'array': true });
        const rnd = () => { return Math.random().toString(16) }

        bStart('base32.encode');
        for (let i = 0; i < bCount; i++) {
            b32.encode(rnd());
        }
        bEnd();
        bStart('base32.encode -> decode');
        for (let i = 0; i < bCount; i++) {
            b32.decode(b32.encode(rnd()));
        }
        bEnd();

        bStart('base32_clockwork.encode');
        for (let i = 0; i < bCount; i++) {
            clkw.encode(rnd());
        }
        bEnd();
        bStart('base32_clockwork.encode -> decode');
        for (let i = 0; i < bCount; i++) {
            clkw.decode(clkw.encode(rnd()));
        }
        bEnd();

        bStart('base32_crockford.encode');
        for (let i = 0; i < bCount; i++) {
            crf.encode(i);
        }
        bEnd();
        bStart('base32_crockford.encode -> decode');
        for (let i = 0; i < bCount; i++) {
            crf.decode(crf.encode(i));
        }
        bEnd();

        bStart('base32_arr.encode');
        for (let i = 0; i < bCount; i++) {
            b32_arr.encode(rnd());
        }
        bEnd();
        bStart('base32.encode -> base32_arr.decode');
        for (let i = 0; i < bCount; i++) {
            b32_arr.decode(b32.encode(rnd()));
        }
        bEnd();

        bStart('base32_crockford_arr.encode');
        for (let i = 0; i < bCount; i++) {
            crf_arr.encode(i ^ 2);
        }
        bEnd();
        bStart('base32_crockford.encode -> decode');
        for (let i = 0; i < bCount; i++) {
            crf_arr.decode(crf.encode(i ^ 2));
        }
        bEnd();

        bStart('base32_crockford_checksum.encode');
        for (let i = 0; i < bCount; i++) {
            crf_c.encode(i ^ 2);
        }
        bEnd();


        //implementation standard of the node.js
        bStart('nodejs:ascii to base64 encode');
        for (let i = 0; i < bCount; i++) {
            Buffer.from(rnd(), 'ascii').toString('base64');
        }
        bEnd();
        bStart('nodejs:ascii to base64 encode -> decode');
        for (let i = 0; i < bCount; i++) {
            Buffer.from(Buffer.from(rnd(), 'ascii').toString('base64'), 'base64').toString('ascii');
        }
        bEnd();


    } catch (e) {
        console.error("\u001b[41m -> \u001b[0m", e);
        process.exit(1);
    }

    console.log("\u001b[32mDone.\u001b[0m\n");
})();

