'use strict';

const fs = require('fs');

function parseImage(image) {
	return image
		.split('\n')
		.map(r => r.split(''));
}

function parseInput(input) {
	const [enhancementArr, image] = input
		.split('\n\n');

	return {
		enhancementArr,
		image: parseImage(image)
	};
}

function padImage(image, defaultChar) {
	const paddedImage = image.map(row => [defaultChar].concat(row).concat([defaultChar]));
	const paddedRow = (new Array(paddedImage[0].length)).fill(defaultChar);

	return [paddedRow]
		.concat(paddedImage)
		.concat([paddedRow]);
}

function getWindowIdx(image, row, col, defaultChar) {
	let numStr = '';
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			const char = image[row + i]?.[col + j] || defaultChar;
			numStr += char === '#' ? '1' : '0';
		}
	}

	return parseInt(numStr, 2);
}

function createImage(rows, cols) {
	const image = new Array(rows);

	for (let i = 0; i < image.length; i++) {
		image[i] = new Array(cols);
		image[i].fill('.');
	}

	return image;
}

function enhanceImage(image, enhancementArr, defaultChar = '.') {
	image = padImage(image, defaultChar);
	const enhancedImage = createImage(image.length, image[0].length);

	for (let i = 0; i < image.length; i++) {
		for (let j = 0; j < image[0].length; j++) {
			const windowIdx = getWindowIdx(image, i, j, defaultChar);

			enhancedImage[i][j] = enhancementArr.charAt(windowIdx);
		}
	}

	return enhancedImage;
}

function solve1({enhancementArr, image}, runs = 2) {
	let enhancedImage = image;

	for (let i = 0; i < runs; i++) {
		enhancedImage = enhanceImage(enhancedImage, enhancementArr, i % 2 === 0 ? '.' : enhancementArr[0]);
	}

	return enhancedImage
		.map(r => r.join(''))
		.join('\n')
		.split('')
		.filter(c => c === '#')
		.length;
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