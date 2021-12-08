'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [patterns, signals] = row.split('|');

	return {
		patterns: patterns.trim().split(' ').map(p => p.split('').sort().join('')),
		signals: signals.trim().split(' ').map(p => p.split('').sort().join(''))
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	const SIGNALS = {
		2: true,
		3: true,
		4: true,
		7: true
	};

	return input.reduce((acc, v) => acc + v.signals.filter(s => SIGNALS[s.length]).length, 0);
}

function deduceSignals({patterns}) {
	const one = patterns.find(p => p.length === 2);
	const four = patterns.find(p => p.length === 4);
	const [six] = patterns.filter(p => p.length === 6 && (!p.includes(one[0]) || !p.includes(one[1])));
	const [tr] = _.pull(one.split(''), ...six.split(''));
	const [br] = _.pull(one.split(''), tr);
	const seven = patterns.find(p => p.length === 3);
	const eight = patterns.find(p => p.length === 7);
	const [two] = patterns.filter(p => p.length === 5 && !p.includes(br));
	const [tl] = _.pull(six.split(''), ...one.split('').concat(two.split('')));
	const [m] = _.pull(four.split(''), tr, tl, br);
	const [zero] = patterns.filter(p => p.length === 6 && !p.includes(m));
	const [nine] = patterns.filter(p => p.length === 6 && p !== six && p !== zero);
	const [bl] = _.pull(eight.split(''), ...nine.split(''));
	const [three] = patterns.filter(p => p.length === 5 && !p.includes(tl) && !p.includes(bl));
	const [five] = patterns.filter(p => p.length === 5 && !p.includes(bl) && !p.includes(tr));

	return {
		[zero]: 0,
		[one]: 1,
		[two]: 2,
		[three]: 3,
		[four]: 4,
		[five]: 5,
		[six]: 6,
		[seven]: 7,
		[eight]: 8,
		[nine]: 9,
	};
}

function solve2(input) {
	return input.reduce((acc, row) => {
		const signalsMap = deduceSignals(row);

		return acc + parseInt(row.signals.map(s => signalsMap[s]).join(''));
	}, 0);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};