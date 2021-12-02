'use strict';

const fs = require('fs');

function parseInput(input) {
	return input.split('').map(x => +x);
}

function solve1(input, iterations = 40) {
	let result = [...input];

	for (let i = 0; i < iterations; i++) {
		let prevNum;
		let numCount = 0;

		result = result.reduce((acc, num) => {
			if (prevNum && prevNum !== num) {
				acc.push(numCount, prevNum);
				numCount = 0;
			}

			numCount++;
			prevNum = num;

			return acc;
		}, []);

		result.push(numCount, prevNum);
	}

	return result.length;
}

function solve2(input) {
	return solve1(input, 50);
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