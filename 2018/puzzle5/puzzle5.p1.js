'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const res = _(input)
	.split('')
	.reduce((acc, char) => {
		const prevChar = acc.pop();

		if (!prevChar) {
			acc.push(char);
		} else {
			const prevCharCode = prevChar.charCodeAt(0);
			const newCharCode = char.charCodeAt(0);

			if (Math.abs(prevCharCode - newCharCode) !== 32) {
				acc.push(prevChar, char);
			}
		}

		return acc;
	}, [])
	.join('')
	.length;

console.log(res);