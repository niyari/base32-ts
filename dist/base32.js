export class Base32 {
    constructor(options = {}) {
        this._dicType = { dic: '', padding: true, validStr: '', variantName: '' };
        this._lastError = { isError: false, errorMessage: '' };
        this._dicType = this.getDictionaryType(options.variant);
        if (options.padding !== undefined) {
            if (options.padding === true) {
                this._dicType.padding = true;
            }
            else {
                this._dicType.padding = false;
            }
        }
        if (this._dicType.variantName === 'crockford') {
            this.encode = this.crockfordEncoder;
            this.decode = this.crockfordDecoder;
        }
        else {
            this.encode = this.multiEncoder;
            this.decode = this.multiDecoder;
        }
    }
    getDictionaryType(variant = '4648') {
        switch (variant) {
            case 'hex': // RFC4648_HEX
                return {
                    dic: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
                    padding: true,
                    validStr: '^(()|[a-v0-9=]+)$',
                    variantName: 'hex'
                };
            case 'maki':
            case 'wah':
            case 'clockwork': // Clockwork Base32
                return {
                    dic: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
                    padding: false,
                    validStr: '^(()|[a-tv-z0-9=]+)$',
                    variantName: 'clockwork'
                };
            case 'crockford':
                return {
                    dic: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
                    padding: false,
                    validStr: '^(()|[a-tv-z0-9*~$=u]+)$',
                    variantName: 'crockford'
                };
            default: // RFC3548 or RFC4648
        }
        return {
            dic: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
            padding: true,
            validStr: '^(()|[a-z2-7=]+)$',
            variantName: '4648'
        };
    }
    crockfordEncoder(input, options = {}) {
        this.resetError();
        let input32 = '';
        let output = '';
        const dic = this._dicType.dic;
        if (typeof input === "number") {
            input = Math.floor(input);
        }
        if (typeof input === "number" || typeof input === "bigint") {
            if (input > -1) {
                input32 = input.toString(32);
            }
        }
        if (input32.length < 1) {
            this._lastError = { isError: true, errorMessage: 'Invalid data: input number.' };
            console.log("Invalid data: input number.");
            return '';
        }
        const check_symbol = () => {
            const check_dic = '0123456789ABCDEFGHJKMNPQRSTVWXYZ*~$=';
            // check_symbol.length + 1 = 37
            return check_dic[Number(BigInt(input) % BigInt(37))];
        };
        (input32.split('')).map(index => {
            output += dic[parseInt(index, 32)];
        });
        if (options.checksum) {
            output += check_symbol();
        }
        if (options.split && Number.isInteger(options.split)) {
            if (options.split > 0 && output.length > 0) {
                const reg = new RegExp('(.{1,' + options.split + '})', 'g');
                output = output.match(reg).join('-');
            }
        }
        return output;
    }
    multiEncoder(input) {
        this.resetError();
        /*
        if (typeof input === "string" || typeof input === "number" || typeof input === "bigint") {
            input = new TextEncoder().encode(input);
        }
         */
        if (typeof input !== "object") {
            input = new TextEncoder().encode(input);
        }
        input = new Uint8Array(input);
        const dic = this._dicType.dic;
        let output = '';
        let value = 0;
        let offset = 0;
        for (let i = 0; i < input.byteLength; i++) {
            value = (value << 8) | input[i];
            offset += 8;
            while (offset >= 5) {
                output += dic[(value >>> (offset - 5)) & 31];
                offset -= 5;
            }
        }
        if (offset > 0) {
            output += dic[(value << (5 - offset)) & 31];
        }
        if (this._dicType.padding) {
            while (output.length % 8 !== 0) {
                output += '=';
            }
        }
        return output;
    }
    crockfordDecoder(input = '', options = {}) {
        this.resetError();
        input = input.toUpperCase().replace(/-/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
        const reg = new RegExp(this._dicType.validStr, 'i');
        if (reg.test(input) === false) {
            this._lastError = { isError: true, errorMessage: 'Invalid data: input strings.' };
            console.log("Invalid data: input strings.");
            input = '';
        }
        const dic = this._dicType.dic;
        const check_symbol = input.slice(-1);
        if (options.checksum) {
            input = input.slice(0, -1);
        }
        const length = input.length;
        const output = new Uint8Array(Math.ceil(length * 5 / 8));
        let outputHexStr = '';
        let index = output.byteLength;
        let value = 0;
        let offset = 0;
        const calcValue = () => {
            outputHexStr = (value & 255).toString(16).padStart(2, '0') + outputHexStr;
            output[--index] = value & 255;
            offset -= 8;
            value = value >>> 8;
        };
        for (let i = length - 1; i >= 0; i--) {
            value = value | (dic.indexOf(input[i]) << offset);
            offset += 5;
            if (offset >= 8) {
                calcValue();
            }
        }
        if (value > 0 || input === '0') {
            calcValue();
        }
        if (output.length > 0 && options.checksum) {
            const verify_symbol = (hexStr) => {
                return (BigInt('0x' + hexStr) % BigInt(37) !== BigInt('0123456789ABCDEFGHJKMNPQRSTVWXYZ*~$=U'.indexOf(check_symbol)));
            };
            if (verify_symbol(outputHexStr)) {
                this._lastError = { isError: true, errorMessage: 'Invalid data: Checksum error.' };
                console.log("Invalid data: Checksum error.");
            }
        }
        if (this._lastError.isError) {
            if (options.raw) {
                return new Uint8Array(1);
            }
            outputHexStr = '0';
        }
        if (options.raw) {
            return output;
        }
        return ('0x' + outputHexStr).replace(/^(0x0+)/, '0x');
    }
    multiDecoder(input = '', options = {}) {
        this.resetError();
        input = input.toUpperCase().replace(/\=+$/, '');
        if (this._dicType.variantName === 'clockwork') {
            input = input.replace(/O/g, '0').replace(/[IL]/g, '1');
        }
        const reg = new RegExp(this._dicType.validStr, 'i');
        if (reg.test(input) === false) {
            this._lastError = { isError: true, errorMessage: 'Invalid data: input strings.' };
            console.log("Invalid data: input strings.");
            input = '';
        }
        const dic = this._dicType.dic;
        const length = input.length;
        const output = new Uint8Array(length * 5 / 8);
        let value = 0;
        let index = 0;
        let offset = 0;
        for (let i = 0; i < length; i++) {
            if (dic.indexOf(input[i]) === -1) {
                this._lastError = { isError: true, errorMessage: 'Invalid data: input strings. ' + input[i] };
                console.log("Invalid character: Out of range.", input[i]);
                break;
            }
            value = (value << 5) | dic.indexOf(input[i]);
            offset += 5;
            if (offset >= 8) {
                output[index++] = (value >>> (offset - 8)) & 255;
                offset -= 8;
            }
        }
        if (options.raw) {
            return output;
        }
        return new TextDecoder().decode(output.buffer);
    }
    resetError() {
        this._lastError = { isError: false, errorMessage: '' };
    }
    lasterror() {
        return this._lastError;
    }
}
