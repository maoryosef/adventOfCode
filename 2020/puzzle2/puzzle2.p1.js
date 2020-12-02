'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [rule, password] = row.split(':');
	const [limit, char] = rule.split(' ');
	const [n1, n2] = limit.split('-');

	return {
		char,
		n1: parseInt(n1),
		n2: parseInt(n2),
		password
	};
}

function validatePassword({char, n1, n2, password}) {
	const occurences = password.split('').filter(c => c === char).length;

	return occurences >= n1 && occurences <= n2;
}

function solve(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	const res = parsedInput.filter(validatePassword);

	return res.length;
}

module.exports = {
	solve
};