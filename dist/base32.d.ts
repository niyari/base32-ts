/*! github.com/niyari/base32-ts/ MIT */
declare type Variant = '3548' | '4648' | 'hex' | 'clockwork' | 'maki' | 'wah' | 'crockford' | '';
interface LastErrorTypes {
    isError: boolean;
    errorMessage: string;
}
interface EncoderOptions {
    variant?: Variant;
    padding?: boolean;
}
interface DecoderOption {
    raw?: boolean;
}
interface CrockFordEncoderOptions {
    split?: number;
    checksum?: boolean;
}
export declare class Base32 {
    private _dicType;
    private _lastError;
    constructor(options?: EncoderOptions);
    private getDictionaryType;
    private crockfordEncoder;
    private multiEncoder;
    private crockfordDecoder;
    private multiDecoder;
    private resetError;
    encode: ((input: bigint | Number, options?: CrockFordEncoderOptions) => string) | ((input: Uint8Array | string) => string);
    decode: (input?: string, options?: DecoderOption) => string | ArrayBuffer;
    lasterror(): LastErrorTypes;
}
export {};
