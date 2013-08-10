Brainfuckme (brainf-ckme)
===========

[![NPM](https://nodei.co/npm/brainfuckme.png?downloads=true)](https://nodei.co/npm/brainfuckme/)

Write the f*cking Brainf*ck code and run the f*ck on the fly.
[Demo page](http://drabiter.com/brainf-ckme).

## Installation
Brainfuckme supports client and server usage. 

For client (browser), use simply grab `lib/brainfuckme.js` and add `<script src="path/to/brainfuckme.js"></script>`

For server (node), use npm command `npm install brainfuckme`

## Usage
*f*ck!*
#### Client
```javascript
var interpreter = new Brainfuckme();
interpreter.run(
  '++++++++++[>+++++++<-]>.',   // source code string
  ['a', 'b'],                   // input data
  {log: true},                  // options
  function(output){             // callback
		console.log(output);
	}
);
```
#### Server
Same as above, but of course it requires this first
```javascript
var Brainfuckme = require('brainfuckme');
```

## Parameters
`(new Brainfuckme()).run(code, input, options, callback);`
- `code`
String which can contains +-,.<>[] code and comments
- `input`
Array of characters. Used as input (duh!)
- `options`
Not much for now, specify boolean for `log` to enable logging
- `callback`
A function that take one argument, the array of character as result.

## Note
*Take every single `f*ck` word on this project as joke*
*If you can't, well, I feel sorry.*