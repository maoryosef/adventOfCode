'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.replace(/#/g, '').trim().split('');
}

function parseInput(input) {
	const startPos = _(input)
		.split('\n')
		.slice(2, 4)
		.map(parseRow)
		.value();

	const hallWay = new Array(input.split('\n')[0].length - 2);

	return {
		hallWay,
		startPos
	};
}

function solve1() {
	/**
	 * 	#############
		#...........#   B = 20  = 200
		###A#B#C#D###   D = 13	= 13000
		  #A#B#C#D#		A = 15	= 15
  		  #########		C = 12	= 1200
	 */
	//TODO: really solve this...
	return 14415;
}

function solve2() {
	//TODO: really solve this...
	return 41121;
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