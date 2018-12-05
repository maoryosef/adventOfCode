'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

function getStrLength(ignoreChar = 'a') {
	return _(input)
		.split('')
		.reduce((acc, char) => {
			if (char.toUpperCase() === ignoreChar.toUpperCase()) {
				return acc;
			}

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
}

let shortestResult = Infinity;

const CHARS = 'abcdefghijklmnopqrstuvwxyz';

Array.from(CHARS).forEach(c => {
	const currentLength = getStrLength(c);

	if (currentLength < shortestResult) {
		shortestResult = currentLength;
	}
});

console.log(shortestResult);