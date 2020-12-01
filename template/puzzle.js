'use strict';

const fs = require('fs');
const _ = require('lodash');

function solve(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = _(input)
		.split('\n')
		.map(num => parseInt(num))
		.value();

	const res = parsedInput.reduce((acc, val) => acc + val, 0);

	return res;
}

module.exports = {
	solve
};