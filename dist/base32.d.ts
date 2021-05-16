/*! github.com/niyari/base32-ts/ MIT */
declare type Variant = '3548' | '4648' | 'hex' | 'clockwork' | 'maki' | 'wah' | 'crockford' | '';
declare type CrockFordEncoderInput = bigint | Number;
declare type MultiEncoderInput = Uint8Array | string;
interface Base32Options {
    variant?: Variant;
    padding?: boolean;
    array?: boolean;
    raw?: boolean;
    split?: number;
    checksum?: boolean;
}
interface ErrorArray {
    isError: boolean;
    message: string;
}
interface ReturnArray {
    data: string | ArrayBuffer;
    error?: ErrorArray;
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
    encode(input: MultiEncoderInput | CrockFordEncoderInput): string | ReturnArray;
    decode(input: string): string | ArrayBuffer | ReturnArray;
    lasterror(): ErrorArray;
}
export {};
