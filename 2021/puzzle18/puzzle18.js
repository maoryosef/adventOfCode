'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(r => r.split(''))
		.value();

	return parsedInput;
}

function parseNumber(numArray, root = null, depth = 0) {
	const node = {p: root, depth};

	while (numArray.length) {
		const char = numArray.shift();

		if (char === '[') {
			node.l = parseNumber(numArray, node, depth + 1);
		} else if (char === ']') {
			return node;
		} else if (char === ',') {
			node.r = parseNumber(numArray, node, depth + 1);
		} else {
			return +char;
		}
	}
}

function incDepth(num) {
	if (_.isNumber(num)) {
		return;
	}

	num.depth++;

	incDepth(num.l);
	incDepth(num.r);

	return num;
}

function add(num1, num2) {
	const newRoot = {p: null, t: 'A', depth: 0};
	num1.p = newRoot;
	num2.p = newRoot;
	newRoot.l = incDepth(num1);
	newRoot.r = incDepth(num2);

	return newRoot;
}

function getNumToExplode(num, pos) {
	if (_.isNumber(num)) {
		return;
	}

	if (num.depth === 4) {
		return {num, pos};
	}

	return getNumToExplode(num.l, 'l') || getNumToExplode(num.r, 'r');
}

function getNumToSplit(num, parent, pos) {
	if (_.isNumber(num)){
		if (num > 9) {
			return {num: parent, pos};
		}
		return;
	}

	return getNumToSplit(num.l, num, 'l') || getNumToSplit(num.r, num, 'r');
}

function addToXMostNumber(root, pos,) {
	let next = root.p;
	let prev = root;
	const opposite = pos === 'l' ? 'r' : 'l';

	while (next) {
		if (next[pos] !== prev) {
			break;
		}

		prev = next;
		next = next.p;
	}

	if (!next) {
		return;
	}

	if (_.isNumber(next[pos])) {
		next[pos] += root[pos];
	} else {
		next = next[pos];

		while (_.isObject(next[opposite])) {
			next = next[opposite];
		}

		next[opposite] += root[pos];
	}
}

function explode({num, pos}) {
	addToXMostNumber(num, 'l', num.l);
	addToXMostNumber(num, 'r', num.r);

	num.p[pos] = 0;
}

function split({num, pos}) {
	const divided = num[pos] / 2;
	const l = Math.floor(divided);
	const r = Math.ceil(divided);

	const newNode = {p: num, depth: num.depth + 1, l, r};
	num[pos] = newNode;
}

function reduce(num) {
	let haveAction = false;

	do {
		const numToExplode = getNumToExplode(num);

		if (numToExplode) {
			haveAction = true;
			explode(numToExplode);
		} else {
			haveAction = false;

			const numToSplit = getNumToSplit(num);

			if (numToSplit) {
				split(numToSplit);
				haveAction = true;
			}
		}
	} while (haveAction);

	return num;
}

function calcMagnitude(num) {
	if (_.isNumber(num)) {
		return num;
	}

	return 3 * calcMagnitude(num.l) + 2 * calcMagnitude(num.r);
}

function solve1(input) {
	let prev = parseNumber(input[0]);

	for (let i = 1; i < input.length; i++) {
		const next = parseNumber(input[i]);

		prev = reduce(add(prev, next));
	}

	return calcMagnitude(prev);
}

function solve2(input) {
	let maxMagnitude = -Infinity;

	for (let i = 0; i < input.length; i++) {
		for (let j = 0; j < input.length; j++) {
			if (i === j) {
				continue;
			}

			const n1 = parseNumber(input[i].slice(0));
			const n2 = parseNumber(input[j].slice(0));

			const m = calcMagnitude(reduce(add(n1, n2)));

			maxMagnitude = Math.max(m, maxMagnitude);
		}
	}

	return maxMagnitude;
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
	exec2: (inputFilename) => exec(inputFilename, solve2)
};