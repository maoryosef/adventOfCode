'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	if (row.length === 1) {
		const values = row[0].split(':')[1].trim().split(' ').map(x => +x);
		return ['seeds', values];
	}

	const [key, ...values] = row;

	return [key.replace(' map:', ''), values.map(v => v.split(' ').map(x => +x))];
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(r => r.split('\n'))
		.map(parseRow)
		.fromPairs()
		.value();

	return parsedInput;
}

const testCases1 = [35];
const expectedRes1 = 600279879;
function solve1(input) {
	const seeds = input.seeds;

	return _(seeds)
		.map(mapToValue(input, 'seed-to-soil'))
		.map(mapToValue(input, 'soil-to-fertilizer'))
		.map(mapToValue(input, 'fertilizer-to-water'))
		.map(mapToValue(input, 'water-to-light'))
		.map(mapToValue(input, 'light-to-temperature'))
		.map(mapToValue(input, 'temperature-to-humidity'))
		.map(mapToValue(input, 'humidity-to-location'))
		.sort((a, b) => a - b)
		.head();
}

function mapToValue(input, name) {
	const map = input[name];
	return seed => {
		const range = map.find(([, s, r]) => seed >= s && seed < s + r);

		if (!range) {
			return seed;
		}

		const offset = seed - range[1];
		return range[0] + offset;
	};
}

function toRanges(input, name) {
	const map = input[name];
	return seedsRangeArray => seedsRangeArray.flatMap(seedsRange => {
		const sS = seedsRange[0];
		const sE = seedsRange[0] + seedsRange[1] - 1;

		const possibleRanges = map
			.filter(([, s, r]) => s + r - 1 >= sS && s <= sE)
			.sort(([,s1], [,s2]) => s1 - s2);

		if (possibleRanges.length === 0) {
			return [seedsRange];
		}

		const allRanges = [...possibleRanges];

		for (let i = 0; i < possibleRanges.length - 1; i++) {
			const r1 = possibleRanges[i];
			const r2 = possibleRanges[i+1];

			if (r1[1] + r1[2] < r2[1]) {
				const newS = r1[1] + r1[2];
				const range = r2[1] - newS;
				allRanges.push([newS, newS, range]);
			}
		}

		if (possibleRanges[0][1] > sS) {
			allRanges.push([sS, sS, possibleRanges[0][1] - sS]);
		}

		const lastRange = possibleRanges.pop();
		const lastRangeE = lastRange[1] + lastRange[2];
		if (lastRangeE < sE) {
			allRanges.push([lastRangeE, lastRangeE, sE - lastRangeE + 1]);
		}

		return allRanges
			.sort(([, s1], [, s2]) => s1 - s2)
			.map(([d, s, r]) => {
				const rS = Math.max(s, sS);
				const rE = Math.min(sE, s + r - 1);

				const offset = d - s;
				return [rS + offset, rE - rS + 1];
			});
	});
}

const testCases2 = [46];
const expectedRes2 = 20191102;
function solve2(input) {
	const seeds = _.chunk(input.seeds, 2).map(x => [x]);
	return _(seeds)
		.map(toRanges(input, 'seed-to-soil'))
		.map(toRanges(input, 'soil-to-fertilizer'))
		.map(toRanges(input, 'fertilizer-to-water'))
		.map(toRanges(input, 'water-to-light'))
		.map(toRanges(input, 'light-to-temperature'))
		.map(toRanges(input, 'temperature-to-humidity'))
		.map(toRanges(input, 'humidity-to-location'))
		.flatten()
		.map(x => x[0])
		.sort((a, b) => a - b)
		.head();
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
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2),
	expectedRes1,
	expectedRes2,
	testCases1,
	testCases2,
	toRanges
};