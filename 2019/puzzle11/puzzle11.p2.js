'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');
const {drawSvg} = require('../../utils/drawUtils');
const {runProgram, parseProgram} = require('../intCodeRunner');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const map = {};
let currentX = 0;
let currentY = 0;
let dir = 'U';

_.set(map, [0, 0], 1);

let outputType = 0;

function onOutput(output) {
	if (outputType === 0) {
		paint(output);
		outputType++;
		return;
	}

	if (outputType === 1) {
		dir = switchDirection(output);
		advanceRobot();
		outputType = 0;
		return;
	}

	throw new Error('WTF');
}

function paint(color) {
	_.set(map, [currentX, currentY], color);
}

function switchDirection(turnRight) {
	if (turnRight) {
		switch (dir) {
			case 'U': return 'R';
			case 'R': return 'D';
			case 'D': return 'L';
			case 'L': return 'U';
		}
	} else {
		switch (dir) {
			case 'U': return 'L';
			case 'L': return 'D';
			case 'D': return 'R';
			case 'R': return 'U';
		}
	}
}

let maxX = -Infinity;
let minX = Infinity;
let maxY = -Infinity;
let minY = Infinity;
function advanceRobot() {
	switch (dir) {
		case 'U': currentY--; break;
		case 'L': currentX--; break;
		case 'D': currentY++; break;
		case 'R': currentX++; break;
	}

	if (currentY > maxY) {
		maxY = currentY;
	}

	if (currentX > maxX) {
		maxX = currentX;
	}

	if (currentY < minY) {
		minY = currentY;
	}

	if (currentX < minX) {
		minX = currentX;
	}
}

const onInputRequest = () => _.get(map, [currentX, currentY], 0);

const program = parseProgram(input);
runProgram([], program, {
	onInputRequest,
	onOutput
});

const WIDTH = 1 + maxX - minX;
const HEIGHT = 1 + maxY - minY;

const image = new Array(HEIGHT);

for (let y = minY; y <= maxY; y++) {
	image[y] = new Array(WIDTH);
	for (let x = minX; x <= maxX; x++) {
		const val = _.get(map, [x, y], 0);
		image[y][x] = val;
	}
}

console.log(drawSvg(image, WIDTH, HEIGHT, {0: '#000', 1: '#FFF'}, 5));