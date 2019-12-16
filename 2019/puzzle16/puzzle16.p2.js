'use strict';

const fs = require('fs');

function solve(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	let signal = input
		.repeat(10000)
		.split('');

	const RUNS = 100;

	let pos = parseInt(signal.slice(0, 7).join(''));

	signal = signal.slice(pos).map(num => parseInt(num));

	for (let i = 0; i < RUNS; i++) {
		const newSignal = new Array(signal.length);

		for (let j = signal.length - 1; j >= 0; j--) {
			newSignal[j] = ((newSignal[j+1] || 0) + signal[j]) % 10;
		}

		signal = newSignal;
	}

	return signal.slice(0, 8).join('');
}

module.exports = {
	solve
};