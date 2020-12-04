'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return _(row)
		.split('\n')
		.flatMap(p => p.split(' '))
		.map(p => p.split(':'))
		.fromPairs()
		.assign()
		.value();
}

function parseInput(input) {
	const parsedInput = input
		.split('\n\n')
		.map(parseRow);

	return parsedInput;
}

function validate(input, validators) {
	return input.filter(passport => _.every(validators, (v, k) => v(passport[k]))).length;
}

function solve1(input) {
	const validators = {
		byr: v => !!v,
		iyr: v => !!v,
		eyr: v => !!v,
		hgt: v => !!v,
		hcl: v => !!v,
		ecl: v => !!v,
		pid: v => !!v
	};

	return validate(input, validators);
}

function solve2(input) {
	const checkYear = (v, from, to) => v && v.length === 4 && parseInt(v) >= from && parseInt(v) <= to;

	const validators = {
		byr: v => checkYear(v, 1920, 2002),
		iyr: v => checkYear(v, 2010, 2020),
		eyr: v => checkYear(v, 2020, 2030),
		hgt: v => {
			const matches = /^(\d+)(cm|in)$/i.exec(v);

			if (matches) {
				const height = parseInt(matches[1]);

				return matches[2] === 'cm' ?
					height >= 150 && height <= 193 :
					height >= 59 && height <= 76;
			}

			return false;
		},
		hcl: v => /^#[0-9a-f]{6}$/i.test(v),
		ecl: v => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(v),
		pid: v => /^\d{9}$/.test(v)
	};

	return validate(input, validators);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};