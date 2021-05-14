import { Base32 as B } from "../dist/base32.js";
(() => {
    let _lPass = true;
    let _lTitle = '';
    let _lFailureList = '';
    let _lTime = 0;
    const lStart = (text) => {
        _lTitle = text;
        console.log("\u001b[43;30m >>>>> " + text + " \u001b[0m");
        _lTime = performance.now();
    }
    const lResult = () => {
        if (_lPass) {
            console.log(" \u001b[44mPASS -> " + _lTitle + " \u001b[0m \n");
        } else {
            console.log("\u001b[101;30m   FAILURE -> " + _lTitle + "   \u001b[0m \n");
        }
        _lTitle = '';
        _lPass = true;
    }
    const cToBe = (value, tobe, title = '') => {
        if (value === tobe) {
            console.log(" \u001b[46m✓ \u001b[0m", title, "\u001b[32m " + value + " \u001b[0m",
                "\u001b[90m" + (performance.now() - _lTime).toPrecision(4) + "ms\u001b[0m");
        } else {
            _lPass = false;
            _lFailureList += _lTitle + " : " + title + "\n";
            console.log("\u001b[101;30m ERROR \u001b[0m", title, ":\u001b[91m " + value + " \u001b[0m", "tobe \u001b[33m " + tobe + " \u001b[0m");
        }
        _lTime = performance.now();
    }
    try {
        lStart('Function:setMode');
        const b32_f = new B();

        const DicType = (t, u) => {
            const dicT = {
                'hex': {
                    dic: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
                    padding: true,
                    re: '^(()|[A-V0-9=]+)$',
                    name: 'hex'
                }, 'clockwork': {
                    dic: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
                    padding: false,
                    re: '^(()|[A-TV-Z0-9=]+)$',
                    name: 'clockwork'
                }, 'crockford': {
                    dic: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
                    padding: false,
                    re: '^(()|[A-TV-Z0-9*~$=U]+)$',
                    name: 'crockford'
                }, '4648': {
                    dic: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
                    padding: true,
                    re: '^(()|[A-Z2-7=]+)$',
                    name: '4648'
                }
            };
            ['dic', 'padding', 're', 'name'].map(target => {
                if (target === 're') {
                    cToBe(t[target].source, dicT[u][target], `${u} ${target}`);

                } else {
                    cToBe(t[target], dicT[u][target], `${u} ${target}`);
                }
            })

        }
        DicType(b32_f.setMode(), '4648');
        DicType(b32_f.setMode('hex'), 'hex');
        DicType(b32_f.setMode('clockwork'), 'clockwork');
        DicType(b32_f.setMode('crockford'), 'crockford');
        DicType(b32_f.setMode('4648'), '4648');
        lResult();

        lStart('RFC4648');
        const b32 = new B();
        cToBe(b32.encode(), '', 'Encode');
        cToBe(b32.decode(), '', 'Decode');
        cToBe(b32.encode('foobar'), 'MZXW6YTBOI======', 'Encode');
        cToBe(b32.decode('MZXW6YTBOI======'), 'foobar', 'Decode');
        cToBe(b32.encode(12345678901234567890n), 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 'Encode (Numeric literal)');
        cToBe(b32.decode("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"), '12345678901234567890', 'Decode (Numeric literal)');
        lResult();

        lStart('RFC4648_HEX');
        const b32_h = new B({ variant: 'hex' });
        cToBe(b32_h.encode('foobar'), 'CPNMUOJ1E8======', 'Encode');
        cToBe(b32_h.decode('CPNMUOJ1E8======'), 'foobar', 'Decode');
        lResult();

        lStart('Clockwork Base32');
        const clkw = new B({ variant: 'clockwork' });
        cToBe(clkw.encode('foobar'), 'CSQPYRK1E8', 'Encode');
        const clkw_s1 = new B({ variant: 'maki' });
        cToBe(clkw_s1.encode('foobar'), 'CSQPYRK1E8', 'Short name "maki"');
        const clkw_s2 = new B({ variant: 'wah' });
        cToBe(clkw_s2.encode('foobar'), 'CSQPYRK1E8', 'Short name "wah"');
        cToBe(clkw.decode('CSQPYRK1E8'), 'foobar', 'Decode');
        lResult();


        lStart('RFC4648/HEX Encode. padding set: true(by default) -> false');
        const b32_pad_on = new B({ padding: true });
        cToBe(b32_pad_on.encode('foobar'), 'MZXW6YTBOI======', 'Padding:true');
        const b32_pad_off = new B({ padding: false });
        cToBe(b32_pad_off.encode('foobar'), 'MZXW6YTBOI', 'Padding:false');
        lResult();

        lStart('Clockwork Encode. padding set: false(by default) -> true');
        const clkw_pad_on = new B({ variant: 'clockwork', padding: true });
        cToBe(clkw_pad_on.encode('foobar'), 'CSQPYRK1E8======', 'Padding:true');
        const clkw_pad_off = new B({ variant: 'clockwork', padding: false });
        cToBe(clkw_pad_off.encode('foobar'), 'CSQPYRK1E8', 'Padding:false');
        lResult();

        lStart('RFC4648/HEX Decode. return Uint8Array');
        cToBe(ArrayBuffer.isView(b32.decode('MZXW6YTBOI======', { raw: true })), true, 'raw:true');
        cToBe(typeof b32.decode('MZXW6YTBOI======', { raw: false }), 'string', 'raw:false');
        lResult();

        lStart('Crockford Base32 Encode');
        const crf = new B({ variant: 'crockford' });
        cToBe(crf.encode(), '', 'Encode');
        cToBe(crf.encode(1234), '16J', 'Encode');
        cToBe(crf.encode(4.2), '4', 'Encode (value 4.2)');

        cToBe(crf.encode(1234, { checksum: true }), '16JD', 'Set Checksum');
        cToBe(crf.encode(0, { checksum: true }), '00', 'Set Checksum (value 0)');

        cToBe(crf.encode(1234, { split: 2 }), '16-J', 'Set split (value 2)');
        cToBe(crf.encode(123456, { split: 1 }), '3-R-J-0', 'Set split (value 1)');
        cToBe(crf.encode(123456, { split: 2 }), '3R-J0', 'Set split (value 2)');
        cToBe(crf.encode(123456, { split: 3 }), '3RJ-0', 'Set split (value 3)');
        cToBe(crf.encode(123456, { split: 4 }), '3RJ0', 'Set split (value 4)');
        lResult();

        lStart('Crockford Base32 Decode');
        cToBe(crf.decode(), '0x0', 'Decode'); // 0x0
        cToBe(Number(crf.decode('16J')), 1234, 'Decode'); // 0x04d2
        cToBe(Number(crf.decode('3RJ0')), 123456, 'Decode');
        cToBe(Number(crf.decode('16JD', { checksum: true })), 1234, 'Checksum');
        cToBe(Number(crf.decode('3r-j0')), 123456, 'Split');
        cToBe(Number(crf.decode('IiLl10Oo')), 35468115968, 'ilo (IiLl10Oo->11111000)');
        cToBe(Number(crf.decode('1-4-S-C-0-P-JV', { checksum: true })), 1234567890, 'Split and Checksum');
        cToBe(ArrayBuffer.isView(crf.decode('-14SC--0PJV-', { checksum: true, raw: true })), true, 'Split, Checksum and return Uint8Array');
        lResult();

        lStart('Decode RegExp \\s');
        cToBe(b32.decode("MZX\n\r W 6 Y T B O \t  I======"), 'foobar', 'Base32');
        cToBe(Number(crf.decode("1-4\n-S\r-C-\t 0-P-JV", { checksum: true })), 1234567890, 'Crockford');
        lResult();

        lStart('Return Array');
        const b32_arr = new B({ 'array': true, raw: true });
        const ret_b32_arr=b32_arr.decode('MZXW6YTBOI======');
        cToBe(ret_b32_arr.data, 'foobar', 'Base32');

        const crf_arr = new B({ variant: 'crockford', 'array': true });
        const ret_crf_arr=crf_arr.decode('14SC0PJV0', { checksum: true });
        cToBe(ret_crf_arr.data, '0x0', 'Crockford: error value');
        cToBe(ret_crf_arr.error.isError, true, 'isError');
        cToBe(ret_crf_arr.error.message, 'Invalid data: Checksum error.', 'message');
        lResult();


    } catch (e) {
        console.error("\u001b[41m -> \u001b[0m", e);
        process.exit(1);
    }

    if (_lFailureList !== '') {
        console.log("\n\u001b[101;30m   !!!!! TEST FAILURE !!!!!   \u001b[0m");
        console.log("\u001b[91m" + _lFailureList + "\u001b[0m");
        process.exit(1);
    }
    console.log("\u001b[32mDone.\u001b[0m\n");
})();

