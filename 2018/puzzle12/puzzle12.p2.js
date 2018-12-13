'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const splittedInput = input.split('\n');
const initialState = splittedInput[0].split(': ')[1].split('');
const genMap = _(splittedInput.splice(2))
	.map(line => {
		const [cond, res] = line.split(' => ');

		return [cond, res === '#'];
	})
	.filter((line) => !!line[1])
	.fromPairs()
	.value();


const PAD = 100;

let originalState = [..._.repeat('.', PAD), ...initialState];
let currentState = originalState.slice(0);
let zeroIdx = PAD;

for (let i = 0; i < 122; i++) {
	const nextState = currentState.slice(0);
	for (let x = 2; x < currentState.length; x++) {
		const potPattern = _.padEnd(currentState.slice(x - 2, x + 3).join(''), 5, '.');
		nextState[x] = genMap[potPattern] ? '#' : '.';
	}

	let potPattern = _.padEnd(currentState.slice(currentState.length - 2).join(''), 5, '.');
	nextState.push(genMap[potPattern] ? '#' : '.');
	potPattern = _.padEnd(currentState.slice(currentState.length - 1).join(''), 5, '.');
	nextState.push(genMap[potPattern] ? '#' : '.');

	currentState = nextState;
}

let count = 0;

for (let i = 0; i < currentState.length; i++) {
	if (currentState[i] === '#') {
		count += (i - zeroIdx);
	}
}

console.log(count);

count = 0;

const wantedGen = 50000000000;
const genOffset = (wantedGen - 1) - 121;
const offset = 81 + genOffset;

for (let i = 0; i < currentState.length; i++) {
	if (currentState[i] === '#') {
		count += (i - zeroIdx - 81) + offset;
	}
}

console.log('calced', count);