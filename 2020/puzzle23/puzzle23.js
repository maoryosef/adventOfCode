'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('')
		.map(x => +x)
		.value();

	return parsedInput;
}

function run(cups, runs = 100) {
	const cupsNum = cups.length;

	let head = {};
	let currentLink = head;
	const cupsMap = {};

	cups.forEach(label => {
		currentLink.next = {label};
		cupsMap[label] = currentLink.next;
		currentLink = currentLink.next;
	});

	head = head.next;
	currentLink.next = head;
	currentLink = head;

	for (let i = 0; i < runs; i++) {
		const detachedS = currentLink.next;
		const detachedE = detachedS.next.next;
		currentLink.next = detachedE.next;

		const pickedCups = [detachedS.label, detachedS.next.label, detachedE.label];

		let targetCup = currentLink.label - 1;

		while (pickedCups.includes(targetCup) || targetCup === 0) {
			targetCup--;
			if (targetCup < 0) {
				targetCup = cupsNum;
			}
		}

		const targetLink = cupsMap[targetCup];
		const detachedTarget = targetLink.next;
		targetLink.next = detachedS;
		detachedE.next = detachedTarget;

		currentLink = currentLink.next;
	}

	return cupsMap[1];
}

function solve1(input) {
	const cup1 = run(input);

	let it = cup1;
	let res = [];

	do {
		res.push(it.label);
		it = it.next;
	} while (it !== cup1);

	return +res.slice(1).join('');
}

function solve2(input) {
	let cups = input.slice(0).concat([...new Array(1000000 - input.length)].map((x, i) => input.length + i + 1));

	const cup1 = run(cups, 10000000);

	return cup1.next.label * cup1.next.next.label;
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