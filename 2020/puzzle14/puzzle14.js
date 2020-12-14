'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [rawOp, rawValue] = row.split(' = ');
	let value = rawValue;
	let op = rawOp;

	if (op !== 'mask') {
		op = rawOp.slice(4, rawOp.length - 1);
		value = parseInt(rawValue).toString(2).padStart(36, '0');
	}

	return {
		op,
		value
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function getMaskedValue(value, mask) {
	const maskedValue = value.split('').reduce((acc, v, idx) => {
		if (mask.charAt(idx) === 'X') {
			acc += v;
		} else {
			acc += mask.charAt(idx);
		}

		return acc;
	}, '');

	return parseInt(maskedValue, 2);
}

function solve1(input) {
	const mem = {};

	let mask;
	for (let command of input) {
		if (command.op === 'mask') {
			mask = command.value;
			continue;
		}

		const maskedValue = getMaskedValue(command.value, mask);

		mem[command.op] = maskedValue;
	}

	return Object.values(mem).reduce((acc, v) => acc + v);
}

function getMaskedAddresses(address, mask) {
	const binaryValue = parseInt(address).toString(2).padStart(36, '0');

	const maskedValue = binaryValue.split('').reduce((acc, v, idx) => {
		if (mask.charAt(idx) === '0') {
			acc.push(v);
		} else {
			acc.push(mask.charAt(idx));
		}

		return acc;
	}, []);

	const addresses = [[]];

	maskedValue.forEach(bit => {
		if (bit === 'X') {
			const newAddresses = [];
			for (let addr of addresses) {
				const newAddr = addr.slice(0);
				newAddr.push('1');
				addr.push('0');
				newAddresses.push(newAddr);
			}

			addresses.push(...newAddresses);

			return;
		}

		for (let addr of addresses) {
			addr.push(bit);
		}
	});

	return addresses.map(addr => parseInt(addr.join(''), 2));
}

function solve2(input) {
	const mem = {};

	let mask;
	for (let command of input) {
		if (command.op === 'mask') {
			mask = command.value;
			continue;
		}

		const maskedAddreses = getMaskedAddresses(command.op, mask);

		maskedAddreses.forEach(addr => {
			mem[addr] = parseInt(command.value, 2);
		});
	}

	return Object.values(mem).reduce((acc, v) => acc + v);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.2.txt';
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