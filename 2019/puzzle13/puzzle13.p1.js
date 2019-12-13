'use strict';

const TEST_MODE=false;

const fs = require('fs');
const {runProgram, parseProgram} = require('../intCodeRunner');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

let blockTiles = 0;
let outputType = 0;

function handleTile(tile) {
	if (tile === 2) {
		blockTiles++;
	}
}

function onOutput(output) {
	switch(outputType) {
		case 0:
		case 1: outputType++; break;
		case 2: outputType = 0; handleTile(output); break;
		default: throw new Error ('WTF');
	}
}

const program = parseProgram(input);
runProgram([], program, {
	onOutput
});

console.log('output:', blockTiles);