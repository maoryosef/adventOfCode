'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [, itemsStr, opStr, testStr, trueStr, falseStr] = row.split('\n');

	const items = itemsStr.split(':')[1].split(',').map(x => +x);
	const test = +testStr.split('Test: divisible by ')[1];
	const trueCase = +trueStr.split('If true: throw to monkey ')[1];
	const falseCase = +falseStr.split('If false: throw to monkey ')[1];

	const [,, operand, arg1] = opStr.split(':')[1].split('= ')[1].match(/(.*?)\s([*+])\s(.*?)$/);

	const op = (itemVal) => {
		const rightOperand = arg1 === 'old' ? itemVal : +arg1;

		return operand === '+' ? itemVal + rightOperand : itemVal * rightOperand;
	};

	return { items, op, test, trueCase, falseCase, inspected: 0 };
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(monkeys, rounds = 20, worryLevel = 3) {
	const commonFactor = monkeys.map(m => m.test).reduce((acc, v) => acc * v, 1);

	for (let i = 0; i < rounds; i++) {
		for (const monkey of monkeys) {
			while (monkey.items.length > 0) {
				monkey.inspected++;
				const item = monkey.items.shift();
				const itemVal = monkey.op(item) % commonFactor;
				const itemValReduced = Math.floor(itemVal / worryLevel);

				if (itemValReduced % monkey.test === 0) {
					monkeys[monkey.trueCase].items.push(itemValReduced);
				} else {
					monkeys[monkey.falseCase].items.push(itemValReduced);
				}
			}
		}
	}

	return _(monkeys)
		.map('inspected')
		.sort((a, b) => b - a)
		.take(2)
		.thru(([m1, m2]) => m1 * m2)
		.value();
}

function solve2(input) {
	return solve1(input, 10000, 1);
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
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};