# base32-ts
Base32 encode/decode for TypeScript

## Usage
### RFC4648
```js
const base32 = new Base32(); // RFC4648
let base32_encoded = base32.encode('foobar');
// str = "MZXW6YTBOI======"
let base32_decoded = base32.decode('MZXW6YTBOI======'); // RFC4648
// str = "foobar"
```


### RFC4648_HEX
```js
const base32_hex = new Base32({ variant: 'hex'}); // RFC4648_HEX
base32_hex.encode('foobar');
// str = "CPNMUOJ1E8======"
base32_hex.decode('CPNMUOJ1E8======'); // RFC4648_HEX
// str = "foobar"
```


### Clockwork Base32
```js
const base32_clockwork = new Base32({ variant: 'clockwork' }); // Clockwork (short name 'maki')
base32_clockwork.encode('foobar');
// str = "CSQPYRK1E8"
base32_clockwork.decode('CSQPYRK1E8'); // Clockwork
// str = "foobar"
```


### Crockford (WIP)
According to the published specification, it seems that the data before encoding must be numeric.
```js
const base32_crockford = new Base32({ variant: 'crockford' }); // Crockford
base32_crockford.encode('foobar');
// str = "CSQPYRK1E8"
```

### Encoding multibyte character set.
```js
base32.encode('Tofu on Fire!📛'); // (📛 = Name Badge:for Japanese preschoolers.)
// str = "KRXWM5JAN5XCARTJOJSSD4E7SONQ===="
```

## Options
### Encode: no padding. ( = ) 
```js
const base32_np = new Base32({ variant: '4648', padding: false }); // RFC4648 no padding
base32_np.encode('foobar');
// str = "MZXW6YTBOI"
```
### Decode: Raw Data
```js
base32.decode('MZXW6YTBOI======'); // (default)
base32.decode('MZXW6YTBOI======', { raw: false });
// Return value: TextDecoder().decode(output.buffer)

base32.decode('MZXW6YTBOI======', { raw: true });
// Return value: Uint8Array
```



## TODO:

Partial support (Checking specifications): [Clockwork Base32]

Partial support (WIP): [Crockford]

## License
MIT

[Clockwork Base32]: https://gist.github.com/szktty/228f85794e4187882a77734c89c384a8
[Crockford]: https://www.crockford.com/base32.html
