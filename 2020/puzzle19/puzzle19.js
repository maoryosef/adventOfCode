'use strict';

const fs = require('fs');

function parseRule(row) {
	const [id, ruleRaw] = row.split(': ');

	const rule = ruleRaw.split(' | ').map(x => x.split(' '));

	return {
		id,
		rule
	};
}

function parseInput(input) {
	const [rulesRaw, messagesRaw] = input
		.split('\n\n');

	const messages = messagesRaw.split('\n');
	const rules = rulesRaw.split('\n').map(rule => parseRule(rule)).reduce((obj, v) => {
		obj[v.id] = v;
		return obj;
	}, {});

	return {rules, messages};
}

function compileRule(rules, id = '0') {
	const {rule} = rules[id];

	const [p1, p2] = rule;

	if (p1[0] === '"a"' || p1[0] === '"b"') {
		return p1[0].charAt(1);
	}

	const rulePart1 = p1.map(rId => compileRule(rules, rId));

	if (!p2) {
		return rulePart1.join('');
	}

	const rulePart2 = p2.map(rId => compileRule(rules, rId));

	return `(?:${rulePart1.join('')}|${rulePart2.join('')})`;
}

function solve1(input) {
	const rule = new RegExp(`^${compileRule(input.rules)}$`);

	return input.messages.filter(message => rule.test(message)).length;
}

function solve2(input) {
	const rule42Str = compileRule(input.rules, '42');
	const rule31Str = compileRule(input.rules, '31');
	const rule11Str = [...new Array(5)].map((x, i) => `${rule42Str}{${i + 1}}${rule31Str}{${i + 1}}`).join('|');
	const rule = new RegExp(`^${rule42Str}+(?:${rule11Str})$`);

	return input.messages.filter(message => rule.test(message)).length;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
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