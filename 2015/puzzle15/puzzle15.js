'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [name, capacity, durability, flavor, texture, calories] = row
		.match(/(.+?): capacity (.*?), durability (.*?), flavor (.*?), texture (.*?), calories (.*)$/)
		.slice(1)
		.map((x, i) => i > 0 ? +x : x);

	return {name, capacity, durability, flavor, texture, calories};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function calcRatios(ingridients, ratios) {
	const result = {};
	for (let i = 0; i < ingridients.length; i++) {
		for (const prop of ['capacity', 'durability', 'flavor', 'texture', 'calories']) {
			result[prop] = result[prop] || 0;
			result[prop] += ratios[i] * ingridients[i][prop];
		}
	}

	return result;
}

function getBestCookie(input, limitCals = false) {
	let max = -Infinity;

	for (let i = 100; i > 0; i--) {
		for (let j = 100 - i; j > 0; j--) {
			for (let k = 100 - i - j; k > 0; k--) {
				for (let l = 100 - i - j - k; l > 0; l--) {
					const ratios = calcRatios(input, [i, j, k, l]);
					if (limitCals && ratios.calories !== 500) {
						continue;
					}

					const {capacity, durability, flavor, texture} = ratios;
					const newVal = [capacity, durability, flavor, texture].map(v => v < 0 ? 0 : v).reduce((acc, v) => acc * v, 1);
					max = Math.max(max, newVal);
				}
			}
		}
	}

	return max;
}

function solve1(input) {
	return getBestCookie(input);
}

function solve2(input) {
	return getBestCookie(input, true);
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