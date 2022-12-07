'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.value();

	return parsedInput;
}

function calcFoldersSize(tree, currentPath = ['']) {
	let folderSize = 0;
	let innerFolders = {};

	for (const [key, val] of Object.entries(tree)) {
		if (typeof val === 'number') {
			folderSize += val;
		} else {
			const folders = calcFoldersSize(val, currentPath.concat(key));
			folderSize += folders[currentPath.concat(key).join('/')];
			innerFolders = {...innerFolders, ...folders};
		}
	}

	innerFolders[currentPath.join('/')] = folderSize;

	return innerFolders;
}

function parseTree(input) {
	const tree = {};
	let currentPath = [];

	for (const command of input) {
		if (command.startsWith('$ cd')) {
			const path = command.substr(5);

			if (path === '/') {
				currentPath = [];
				continue;
			}

			if (path === '..') {
				currentPath.pop();
				continue;
			}

			currentPath.push(path);
			continue;
		}

		if (command === '$ ls' || command.startsWith('dir ')) {
			continue;
		}

		const [size, filename] = command.split(' ');
		_.set(tree, currentPath.concat(filename), +size);
	}

	return tree;
}
function solve1(input) {
	return _(input)
		.thru(parseTree)
		.thru(calcFoldersSize)
		.filter(size => size <= 100000)
		.sum();
}

function solve2(input) {
	const totalSpace = 70000000;
	const updateSize = 30000000;

	const folders = calcFoldersSize(parseTree(input));

	const freeSpace = totalSpace - folders[''];
	const requiredSpace = updateSize - freeSpace;

	const res = _(folders)
		.filter(size => size >= requiredSpace)
		.sort((a, b) => a - b)
		.head();

	return res;
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