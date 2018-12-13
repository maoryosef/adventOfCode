'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const GENERATIONS = 20;
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

let currentState = [..._.repeat('.', PAD), ...initialState];
let zeroIdx = PAD;
//[(.),.,#,#]
for (let i = 0; i < GENERATIONS; i++) {
	const nextState = currentState.slice(0);
	for (let x = 0; x < currentState.length; x++) {
		const potPattern = _.padEnd(currentState.slice(Math.max(x - 2, 0), x + 3).join(''), 5, '.');
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