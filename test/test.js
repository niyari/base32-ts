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
        logTitle('Function:getDictionaryType');
        const base32_f = new Base32();

        const DicTypeCheck = (t, u) => {
            const DicTypes = {
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
                    checkToBe(t[target].source, DicTypes[u][target], `${u} ${target}`);

                } else {
                    checkToBe(t[target], DicTypes[u][target], `${u} ${target}`);
                }
            })

        }
        DicTypeCheck(base32_f.setMode(), '4648');
        DicTypeCheck(base32_f.setMode('hex'), 'hex');
        DicTypeCheck(base32_f.setMode('clockwork'), 'clockwork');
        DicTypeCheck(base32_f.setMode('crockford'), 'crockford');
        DicTypeCheck(base32_f.setMode('4648'), '4648');
        logResult();

        logTitle('RFC4648');
        const base32 = new Base32();
        checkToBe(base32.encode('foobar'), 'MZXW6YTBOI======', 'Encode');
        checkToBe(base32.decode('MZXW6YTBOI======'), 'foobar', 'Decode');
        checkToBe(base32.encode(12345678901234567890n), 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 'Encode (Numeric literal)');
        checkToBe(base32.decode("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"), '12345678901234567890', 'Decode (Numeric literal)');
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

        logTitle('Decode RegExp \\s');
        checkToBe(base32.decode("MZX\n\r W 6 Y T B O \t  I======"), 'foobar', 'Base32');
        checkToBe(Number(base32_crockford.decode("1-4\n-S\r-C-\t 0-P-JV", { checksum: true })), 1234567890, 'Crockford');
        logResult();

        logTitle('Return Array');
        const base32_arr = new Base32({ 'array': true, raw: true });
        const ret_base32_arr=base32_arr.decode('MZXW6YTBOI======');
        checkToBe(ret_base32_arr.data, 'foobar', 'Base32');

        const base32_crockford_arr = new Base32({ variant: 'crockford', 'array': true });
        const ret_base32_crockford_arr=base32_crockford_arr.decode('14SC0PJV0', { checksum: true });
        checkToBe(ret_base32_crockford_arr.data, '0x0', 'Crockford: error value');
        checkToBe(ret_base32_crockford_arr.error.isError, true, 'isError');
        checkToBe(ret_base32_crockford_arr.error.message, 'Invalid data: Checksum error.', 'message');
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

