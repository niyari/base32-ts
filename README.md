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
const base32_hex = new Base32({ variant: 'hex' });
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
new Base32([{ [variant] [,padding] [,raw] [,checksum] [,split] }]);
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
```
{ padding: <bool> }
```

| | RFC4648 | HEX | Clockwork  | Crockford
---: | :---: | :---: | :---: | :---:
| default | True | True | False | -

```js
const base32_np = new Base32({ padding: false }); // RFC4648 no padding
base32_np.encode('foobar');
// str = "MZXW6YTBOI"
const b32_cw_pad = new Base32({ variant: 'maki', padding: true }); // Clockwork use padding
b32_cw_pad.encode('foobar');
// str = "CSQPYRK1E8======"
```


### Decode: Raw
Return Uint8Array object.
```
{ raw: <bool> }
```

| | RFC4648 | HEX | Clockwork  | Crockford
---: | :---: | :---: | :---: | :---:
| default | False | False | False | False(hexadecimal string) 

```js
const base32 = new Base32();
base32.decode('MZXW6YTBOI======'); // (default)
const base32_raw0 = new Base32({ raw: false });
base32_raw0.decode('MZXW6YTBOI======');
// Return value: String

const base32_raw1 = new Base32({ raw: true });
base32_raw1.decode('MZXW6YTBOI======');
const base32_crockford_raw = new Base32({ variant: 'crockford', raw: true });
base32_crockford_raw.decode(123456);
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
{ variant: 'crockford' }
```

### Checksum
```
{ variant: 'crockford', checksum: <bool> }
```

| | RFC4648 | HEX | Clockwork  | Crockford
---: | :---: | :---: | :---: | :---:
| default | - | - | - | False

```js
const base32_crockford = new Base32({ variant: 'crockford', checksum: true });
base32_crockford.encode(1234);
// str = "16JD"
base32_crockford.decode('16JD');
// str = "0x04d2" = 1234
```


### Encode: Split
```
{ variant: 'crockford', split: <unsigned integer> }
```

| | RFC4648 | HEX | Clockwork  | Crockford
---: | :---: | :---: | :---: | :---:
| default | - | - | - | 0

```js
const base32_crockford = new Base32({ variant: 'crockford', split: 2 });
base32_crockford.encode(123456);
// str = "3R-J0"
const base32_crockford_s1 = new Base32({ variant: 'crockford', split: 1 });
base32_crockford_s1.encode(123456);
// str = "3-R-J-0"
```


## See Also:
 [Clockwork Base32]

 [Crockford]


## License
MIT

[Clockwork Base32]: https://gist.github.com/szktty/228f85794e4187882a77734c89c384a8
[Crockford]: https://www.crockford.com/base32.html
