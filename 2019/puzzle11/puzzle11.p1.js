'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');
const {runProgram, parseProgram} = require('../intCodeRunner');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const map = {};
let currentX = 0;
let currentY = 0;
let dir = 'U';

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

let painted = 0;
function paint(color) {
	const val = _.get(map, [currentX, currentY]);

	if (_.isNil(val)) {
		painted++;
	}

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

function advanceRobot() {
	switch (dir) {
		case 'U': currentY--; break;
		case 'L': currentX--; break;
		case 'D': currentY++; break;
		case 'R': currentX++; break;
	}
}

const onInputRequest = () => _.get(map, [currentX, currentY], 0);

const program = parseProgram(input);
runProgram([], program, {
	onInputRequest,
	onOutput
});

console.log('output:', painted);