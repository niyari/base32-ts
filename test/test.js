import { Base32 } from "../dist/base32.js";
(() => {
    let _logPass = true;
    let _logTitle = '';
    let _logFailureList = '';
    let _logTime = 0;
    const logTitle = (text) => {
        _logTitle = text;
        console.log("\u001b[43;30m >>>>> " + text + " \u001b[0m");
        _logTime = performance.now();
    }
    const logResult = () => {
        if (_logPass) {
            console.log(" \u001b[44mPASS -> " + _logTitle + " \u001b[0m \n");
        } else {
            console.log("\u001b[101;30m   FAILURE -> " + _logTitle + "   \u001b[0m \n");
        }
        _logTitle = '';
        _logPass = true;
    }
    const checkToBe = (value, tobe, title = '') => {
        if (value === tobe) {
            console.log(" \u001b[46m✓ \u001b[0m", title, "\u001b[32m " + value + " \u001b[0m",
                "\u001b[90m" + (performance.now() - _logTime).toPrecision(4) + "ms\u001b[0m");
        } else {
            _logPass = false;
            _logFailureList += _logTitle + " : " + title + "\n";
            console.log("\u001b[101;30m ERROR \u001b[0m", title, ":\u001b[91m " + value + " \u001b[0m", "tobe \u001b[33m " + tobe + " \u001b[0m");
        }
        _logTime = performance.now();
    }
    try {
        logTitle('RFC4648');
        const base32 = new Base32();
        checkToBe(base32.encode('foobar'), 'MZXW6YTBOI======', 'Encode');
        checkToBe(base32.decode('MZXW6YTBOI======'), 'foobar', 'Decode');
        logResult();

        logTitle('RFC4648_HEX');
        const base32_hex = new Base32({ variant: 'hex' });
        checkToBe(base32_hex.encode('foobar'), 'CPNMUOJ1E8======', 'Encode');
        checkToBe(base32_hex.decode('CPNMUOJ1E8======'), 'foobar', 'Decode');
        logResult();

        logTitle('Clockwork Base32');
        const base32_clockwork = new Base32({ variant: 'clockwork' });
        checkToBe(base32_clockwork.encode('foobar'), 'CSQPYRK1E8', 'Encode');
        const base32_clockwork_short1 = new Base32({ variant: 'maki' });
        checkToBe(base32_clockwork_short1.encode('foobar'), 'CSQPYRK1E8', 'Short name "maki"');
        const base32_clockwork_short2 = new Base32({ variant: 'wah' });
        checkToBe(base32_clockwork_short2.encode('foobar'), 'CSQPYRK1E8', 'Short name "wah"');
        checkToBe(base32_clockwork.decode('CSQPYRK1E8'), 'foobar', 'Decode');
        logResult();


        logTitle('RFC4648/HEX Encode. padding set: true(by default) -> false');
        const base32_padding_on = new Base32({ padding: true });
        checkToBe(base32_padding_on.encode('foobar'), 'MZXW6YTBOI======', 'Padding:true');
        const base32_padding_off = new Base32({ padding: false });
        checkToBe(base32_padding_off.encode('foobar'), 'MZXW6YTBOI', 'Padding:false');
        logResult();

        logTitle('Clockwork Encode. padding set: false(by default) -> true');
        const base32_clockwork_padding_on = new Base32({ variant: 'clockwork', padding: true });
        checkToBe(base32_clockwork_padding_on.encode('foobar'), 'CSQPYRK1E8======', 'Padding:true');
        const base32_clockwork_padding_off = new Base32({ variant: 'clockwork', padding: false });
        checkToBe(base32_clockwork_padding_off.encode('foobar'), 'CSQPYRK1E8', 'Padding:false');
        logResult();

        logTitle('RFC4648/HEX Decode. return Uint8Array');
        checkToBe(ArrayBuffer.isView(base32.decode('MZXW6YTBOI======', { raw: true })), true, 'raw:true');
        checkToBe(typeof base32.decode('MZXW6YTBOI======', { raw: false }), 'string', 'raw:false');
        logResult();

        logTitle('Crockford Base32 Encode');
        const base32_crockford = new Base32({ variant: 'crockford' });
        checkToBe(base32_crockford.encode(1234), '16J', 'Encode');
        checkToBe(base32_crockford.encode(4.2), '4', 'Encode (value 4.2)');

        checkToBe(base32_crockford.encode(1234, { checksum: true }), '16JD', 'Set Checksum');
        checkToBe(base32_crockford.encode(0, { checksum: true }), '00', 'Set Checksum (value 0)');

        checkToBe(base32_crockford.encode(1234, { split: 2 }), '16-J', 'Set split (value 2)');
        checkToBe(base32_crockford.encode(123456, { split: 1 }), '3-R-J-0', 'Set split (value 1)');
        checkToBe(base32_crockford.encode(123456, { split: 2 }), '3R-J0', 'Set split (value 2)');
        checkToBe(base32_crockford.encode(123456, { split: 3 }), '3RJ-0', 'Set split (value 3)');
        checkToBe(base32_crockford.encode(123456, { split: 4 }), '3RJ0', 'Set split (value 4)');
        logResult();

        logTitle('Crockford Base32 Decode');
        checkToBe(Number(base32_crockford.decode('16J')), 1234, 'Decode'); // 0x04d2
        checkToBe(Number(base32_crockford.decode('3RJ0')), 123456, 'Decode');
        checkToBe(Number(base32_crockford.decode('16JD', { checksum: true })), 1234, 'Checksum');
        checkToBe(Number(base32_crockford.decode('3r-j0')), 123456, 'Split');
        checkToBe(Number(base32_crockford.decode('IiLl10Oo')), 35468115968, 'ilo (IiLl10Oo->11111000)');
        checkToBe(Number(base32_crockford.decode('1-4-S-C-0-P-JV', { checksum: true })), 1234567890, 'Split and Checksum');
        checkToBe(ArrayBuffer.isView(base32_crockford.decode('-14SC--0PJV-', { checksum: true, raw: true })), true, 'Split, Checksum and return Uint8Array');
        logResult();


    } catch (e) {
        console.error("\u001b[41m -> \u001b[0m", e);
        process.exit(1);
    }

    if (_logFailureList !== '') {
        console.log("\n\u001b[101;30m   !!!!! TEST FAILURE !!!!!   \u001b[0m");
        console.log("\u001b[91m" + _logFailureList + "\u001b[0m");
        process.exit(1);
    }
    console.log("\u001b[32mDone.\u001b[0m\n");
})();

