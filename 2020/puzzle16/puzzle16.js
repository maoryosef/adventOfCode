'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRules(row) {
	return _(row)
		.split('\n')
		.map(r => r.split(': '))
		.fromPairs()
		.mapValues(v => v.split(' or ').map(x => x.split('-').map(n => +n)))
		.value();
}

function parseInput(input) {
	const [rulesRaw, ticketRaw, nearTicketsRaw] = _(input)
		.split('\n\n')
		.value();

	const rules = parseRules(rulesRaw);
	const [ticket] = ticketRaw.split('\n').slice(1).map(t => t.split(',').map(x => +x));
	const nearTickets = nearTicketsRaw.split('\n').slice(1).map(t => t.split(',').map(x => +x));

	return {
		rules,
		ticket,
		nearTickets
	};
}

function isValid(num, rules) {
	for (let [, [[min1, max1], [min2, max2]]] of Object.entries(rules)) {
		if (num >= min1 && num <= max1) {
			return true;
		}

		if (num >= min2 && num <= max2) {
			return true;
		}
	}

	return false;
}

function solve1({ rules, nearTickets }) {
	return nearTickets.reduce((acc, v) => acc + _.sum(v.filter(n => !isValid(n, rules))), 0);
}

function solve2({ rules, nearTickets, ticket: myTicket }) {
	const validTickets = [...nearTickets, myTicket].filter(t => t.every(n => isValid(n, rules)));

	const positions = validTickets[0].length;
	const possiblePositionsMap = _.fromPairs(Object.keys(rules)
		.map(r => [r, new Set([...Array(positions)].map((x, i) => i + 1))]));

	for (let ticket of validTickets) {
		for (let [idx, field] of ticket.entries()) {
			for (let [rule, [[min1, max1], [min2, max2]]] of Object.entries(rules)) {
				if ((field < min1 || field > max1) && field < min2 || field > max2) {
					possiblePositionsMap[rule].delete(idx + 1);
				}
			}
		}
	}

	const foundRules = Object.entries(possiblePositionsMap).filter(r => r[1].size === 1);

	while (foundRules.length > 0) {
		const singleRule = foundRules.shift();
		const key = [...singleRule[1].keys()].pop();

		for (let rule of Object.entries(possiblePositionsMap)) {
			if (rule[1].size === 1) {
				continue;
			}

			rule[1].delete(key);
			if (rule[1].size === 1) {
				foundRules.push(rule);
			}
		}
	}

	return Object.entries(possiblePositionsMap).reduce((acc, rule) => {
		if (rule[0].startsWith('departure')) {
			const [v] = [...rule[1]];

			acc *= myTicket[v - 1];
		}

		return acc;
	}, 1);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
	const { join } = require('path');

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