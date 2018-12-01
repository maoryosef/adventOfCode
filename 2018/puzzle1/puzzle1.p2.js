'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');
const seenMap = { 0: true };
let duplicateNumber = null;

const normalizedInput = _(input)
	.split('\n')
	.map(num => parseInt(num))
	.value();

let accumulated = 0;

while (duplicateNumber === null) {
	for (let n of normalizedInput) {
		accumulated += n;

		if (seenMap[accumulated]) {
			duplicateNumber = accumulated;
			break;
		}

		seenMap[accumulated] = true;
	}
}

console.log(duplicateNumber);
