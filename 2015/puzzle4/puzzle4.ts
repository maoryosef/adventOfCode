import fs from 'fs';
import crypto from 'crypto';

function parseInput(input: string) {
	return input;
}

function findHashNum(input: string, value = '00000') {
	let num = 1;
	let hash;

	do  {
		hash = crypto.createHash('md5').update(`${input}${++num}`).digest('hex');
	} while (!hash.startsWith(value));

	return num;
}

function solve1(input: string) {
	return findHashNum(input);
}

function solve2(input: string) {
	return findHashNum(input, '000000');
}

function exec(inputFilename: string, solver: Function, inputStr?: string) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path')

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};