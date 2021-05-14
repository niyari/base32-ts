# base32-ts
Base32 encode/decode for TypeScript

## Install
```sh
npm i @niyari/base32-ts
```

## Demo
https://niyari.github.io/base32-ts/demo/

## Supported Browsers
ECMAScript 2020 and later. (Using BigInt within Crockford.)

* Chrome 89+
* Firefox 87+
* Safari 14+
* Edge(Chromium) 89+

## Usage
### RFC4648
```js
const base32 = new Base32();
let base32_encoded = base32.encode('foobar');
// str = "MZXW6YTBOI======"
let base32_decoded = base32.decode('MZXW6YTBOI======');
// str = "foobar"
```


### RFC4648_HEX
```js
const base32_hex = new Base32({ variant: 'hex'});
base32_hex.encode('foobar');
// str = "CPNMUOJ1E8======"
base32_hex.decode('CPNMUOJ1E8======');
// str = "foobar"
```


### Clockwork Base32
```js
const base32_clockwork = new Base32({ variant: 'clockwork' }); // Clockwork (short name 'maki')
base32_clockwork.encode('foobar');
// str = "CSQPYRK1E8"
base32_clockwork.decode('CSQPYRK1E8');
// str = "foobar"
```

### Encoding multibyte character set
```js
base32.encode('Tofu on Fire!📛'); // (📛 = Name Badge:for Japanese preschoolers.)
// str = "KRXWM5JAN5XCARTJOJSSD4E7SONQ===="
```


## API(Options)
```
new Base32([option]);
```
### Variant
```
{ variant: '<string>' }
```
* RFC4648
  * `4648`
  * `3548` 
  * (empty) 
* RFC4648_HEX
  * `hex`
* Clockwork Base32
  * `clockwork`
  * `maki`
* Crockford
  * `crockford`


### Encode: Set padding ( = ) 
_ | RFC4648 | HEX | Clockwork  | Crockford
---: | :---: | :---: | :---: | :---:
**default**| True | True | False | -
```
{'padding':<bool>}
```

```js
const base32_np = new Base32({ padding: false }); // RFC4648 no padding
base32_np.encode('foobar');
// str = "MZXW6YTBOI"
const b32_cw_pad = new Base32({ variant: 'maki', padding: true }); // Clockwork use padding
b32_cw_pad.encode('foobar');
// str = "CSQPYRK1E8======"
```


### Decode: Raw
Return Uint8Array.
```
base32.decode(data, { raw: <bool> });
```

_ | RFC4648 | HEX | Clockwork  | Crockford
---: | :---: | :---: | :---: | :---:
**default**| False | False | False | False(hexadecimal string) 

```js
base32.decode('MZXW6YTBOI======'); // (default)
base32.decode('MZXW6YTBOI======', { raw: false });
// Return value: String

base32.decode('MZXW6YTBOI======', { raw: true });
// Return value: Uint8Array object
```



## Crockford
Encode an integer into a Crockford Symbol string.

### Usage
```js
const base32_crockford = new Base32({ variant: 'crockford' });
base32_crockford.encode(1234);
// str = "16J"
base32_crockford.decode('16J');
// str = "0x04d2" = 1234
```

In decoding, the misleading character "IiLl" is treated as 1 and "Oo" is treated as 0.
```js
base32_crockford.decode('IiLl10Oo');
// str = "0x842108000"
```

## API(Options)
```
new Base32({ variant: 'crockford'});
```
### Encode: Checksum
```
crockford.encode(integer, { checksum: <bool> });
```
```js
base32_crockford.encode(1234, { checksum: true });
// str = "16JD"
base32_crockford.decode('16JD', { checksum: true });
// str = "0x04d2" = 1234
```


### Encode: Split
```
crockford.encode(integer, { split: <number> });
```
```js
base32_crockford.encode(123456, { split: 2 });
// str = "3R-J0"
base32_crockford.encode(123456, { split: 1 });
// str = "3-R-J-0"
```

### Decode: Raw
```js
base32_crockford.decode(123456, { raw: true });
// Uint8Array object
```


## See Also:
 [Clockwork Base32]

 [Crockford]


## License
MIT

[Clockwork Base32]: https://gist.github.com/szktty/228f85794e4187882a77734c89c384a8
[Crockford]: https://www.crockford.com/base32.html
