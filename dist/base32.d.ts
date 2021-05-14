/*! github.com/niyari/base32-ts/ MIT */
declare type Variant = '3548' | '4648' | 'hex' | 'clockwork' | 'maki' | 'wah' | 'crockford' | '';
interface Base32Options {
    variant?: Variant;
    padding?: boolean;
    array?: boolean;
}
interface CrockFordEncoderOptions {
    split?: number;
    checksum?: boolean;
}
interface CrockFordDecoderOptions {
    checksum?: boolean;
    raw?: boolean;
}
interface LastErrorTypes {
    isError: boolean;
    message: string;
}
interface ReturnArray {
    data: string | ArrayBuffer;
    error?: LastErrorTypes;
}
export declare class Base32 {
    private _mode;
    private _lastError;
    constructor(options?: Base32Options);
    private setMode;
    private crockfordEncoder;
    private multiEncoder;
    private crockfordDecoder;
    private multiDecoder;
    private returnArray;
    private setError;
    private resetError;
    encode: ((input: bigint | Number, options?: CrockFordEncoderOptions) => string | ReturnArray) | ((input: Uint8Array | string) => string | ReturnArray);
    decode: (input?: string, options?: CrockFordDecoderOptions) => string | ArrayBuffer | ReturnArray;
    lasterror(): LastErrorTypes;
}
export {};
