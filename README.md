Brainfuckme (brainf-ckme)
===========

[![Build Status][travis-img]][travis-url]
[![Coverage Status][coveralls-img]][coveralls-url]
[![NPM Download][npm-img]][npm-url]

[travis-img]: http://img.shields.io/travis/drabiter/brainf-ckme.svg?style=flat-square
[travis-url]: https://travis-ci.org/drabiter/brainf-ckme
[coveralls-img]: http://img.shields.io/coveralls/drabiter/brainf-ckme.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/drabiter/brainf-ckme?branch=master
[npm-img]: http://img.shields.io/npm/v/npm.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/brainfuckme

[![NPM](https://nodei.co/npm/brainfuckme.png?downloads=true)](https://nodei.co/npm/brainfuckme/)

Write the f*cking Brainf*ck code and run the f-ck.
[Demo page](http://drabiter.com/brainf-ckme).

## Installation
Brainfuckme supports client and server usage.

For client (browser), use simply grab `lib/brainfuckme.js` and add `<script src="path/to/brainfuckme.js"></script>`

For server (node), use npm command `npm install brainfuckme`

## Usage
#### Client
```javascript
var bfkme = new Brainfuckme();
bfkme.run(
  ',[.,]',                      // source code string
  [97, 98, 99],                 // input data
  function(output){             // callback
    console.log(output);        // `output` is [97, 98, 99]
  }
);
```
#### Server
```javascript
var Brainfuckme = require('brainfuckme');
var bfme        = new Brainfuckme();
bfme.run()
```

## API
`.run(code, input, callback)`
- `code` String which can contains +-,.<>[] code and comments
- `input` Array of integers. Used as input (duh!)
- `callback` A function that take two args, the array of integers and its String representation.

`.resume(code, input, callback)` - same as `.run()`.

`inputToArray(string)` - converts *string* into array of integers.

`.outputToString()` - returns the output stack as String. `[110, 121, 97, 110, 99, 97, 116]` will return *nyancat*.

`.value()` - return value of current pointed cell.

`.reset()` - reset the object's state (cursor, output stack, input stack, pointer).

## Changelog

**0.2.1**
- Now available in two flavors, coffee and vanilla
- Various fixes
