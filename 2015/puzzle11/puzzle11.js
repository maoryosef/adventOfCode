'use strict';

const fs = require('fs');

function parseInput(input) {
	const parsedInput = input.split('');

	return parsedInput;
}

const INVALID_LETTERS = /[iol]/;
const DOUBLES = /(.)(?:\1)/g;
const ASCENDING = /abc|bcd|cde|def|efg|fgh|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/;

function isValid(str) {
	return !INVALID_LETTERS.test(str)
	&& new Set([...str.matchAll(DOUBLES)].map(x => x[1])).size > 1
	&& ASCENDING.test(str);
}

function incStr(arr) {
	let incIdx = arr.length - 1;

	while (incIdx > 0) {
		const c = arr[incIdx];
		if (c === 'z') {
			arr[incIdx] = 'a';
			incIdx--;
			continue;
		}

		if (c === 'h') {
			arr[incIdx]	= 'j';
		} else if (c === 'k') {
			arr[incIdx]	= 'm';
		} else if (c === 'n') {
			arr[incIdx]	= 'p';
		} else {
			arr[incIdx] = String.fromCharCode(arr[incIdx].charCodeAt(0) + 1);
		}

		incIdx = -1;
	}

	return arr;
}

function solve1(input) {
	do {
		incStr(input);
	} while (!isValid(input.join('')));

	return input.join('');
}

function solve2(input) {
	const firstPwd = solve1(input);

	return solve1(firstPwd.split(''));
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