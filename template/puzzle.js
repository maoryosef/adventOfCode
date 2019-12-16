'use strict';

const fs = require('fs');
const _ = require('lodash');

function solve(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const res = _(input)
		.split('\n')
		.map(num => parseInt(num))
		.reduce((acc, val) => acc + val, 0);

	return res;
}

module.exports = {
	solve
};