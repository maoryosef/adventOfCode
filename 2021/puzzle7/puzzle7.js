'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split(',')
		.map(x => parseInt(x))
		.value();

	return parsedInput;
}

function getMedian(array) {
	const mid = array.length / 2;

	if (array.length % 2 === 0) {
		return (array[mid] + array[mid - 1]) / 2;
	}

	return array[mid];
}

const sumDiffs = (array, median = 0) =>
	array.reduce((acc, v) => acc + Math.abs(v - median), 0);

function solve1(input) {
	const median = getMedian(input.sort((a, b) => a - b));

	return sumDiffs(input, median);
}

const getAverage = (array) => sumDiffs(array) / array.length;

const seriesSum = (n) => n * (1 + n) / 2;

function solve2(input) {
	const avg = Math.floor(getAverage(input));

	return input.reduce((acc, v) => acc + seriesSum(Math.abs(v - avg)), 0);
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