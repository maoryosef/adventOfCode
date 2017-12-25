const fs = require('fs');
const _ = require('lodash');

const states = JSON.parse(fs.readFileSync(`${__dirname}/input.json`, 'utf-8'));
const tape = {0: 0};
let cursor = 0;
const STEPS = 12317297;
let currentState = states.A;

for (let i = 0; i < STEPS; i++) {
	const val = tape[cursor] || 0;
	tape[cursor] = currentState[val].newVal;
	cursor += currentState[val].move;
	currentState = states[currentState[val].nextState];
}

const checkSum = _(tape).values().reduce((acc, val) => acc += val, 0);

console.log(`checkSum = ${checkSum}`);

