'use strict';

const fs = require('fs');
const crypto = require('crypto');

function parseInput(input) {
	return input;
}

function findHashNum(input, value = '00000') {
	let num = 1;
	let hash;

	do  {
		hash = crypto.createHash('md5').update(`${input}${++num}`).digest('hex');
	} while (!hash.startsWith(value));

	return num;
}

function solve1(input) {
	return findHashNum(input);
}

function solve2(input) {
	return findHashNum(input, '000000');
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};