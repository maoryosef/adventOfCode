'use strict';

const TEST_MODE=false;

const fs = require('fs');
const {runProgram, parseProgram} = require('../intCodeRunner');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const pos = {};
let score = 0;
let outputType = 0;
let paddleX;
let ballX;

function handleTile(value) {
	if (pos.x === -1 && pos.y === 0) {
		score = value;
		return;
	}

	switch(value) {
		case 3: paddleX = pos.x; break;
		case 4: ballX = pos.x; break;
	}
}

function onOutput(output) {
	switch (outputType) {
		case 0: pos.x = output; outputType++; break;
		case 1: pos.y = output; outputType++; break;
		case 2: outputType = 0; handleTile(output); break;
		default: throw new Error ('WTF');
	}
}

function onInputRequest() {
	if (ballX > paddleX) {
		return 1;
	}

	if (ballX < paddleX) {
		return -1;
	}

	return 0;
}

const program = parseProgram(input);
program[0] = 2;
runProgram([], program, {
	onInputRequest,
	onOutput
});

console.log('output:', score);