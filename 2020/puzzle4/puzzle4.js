'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	if (_.trim(row).length > 0) {
		return _(row)
			.split(' ')
			.map(pair => pair.split(':'))
			.fromPairs()
			.value();
	}

	return null;
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.reduce((acc, val) => {
			if (!val) {
				acc.push({});
			}

			acc[acc.length - 1] = {...acc[acc.length - 1], ...val};

			return acc;
		}, [{}]);

	return parsedInput;
}

function validate(input, requiredFields, validators) {
	return input.reduce((acc, val) => {
		const numOfRequiredFields = _(val)
			.pick(requiredFields)
			.keys()
			.value();

		if (numOfRequiredFields.length === requiredFields.length) {
			if (!validators) {
				acc++;
			} else if (_.every(validators, (v, k) => v(val[k]))) {
				acc++;
			}
		}

		return acc;
	}, 0);
}

const checkYear = (v, from, to) => v.length === 4 && parseInt(v) >= from && parseInt(v) <= to;

const validators = {
	byr: v => checkYear(v, 1920, 2002),
	iyr: v => checkYear(v, 2010, 2020),
	eyr: v => checkYear(v, 2020, 2030),
	hgt: v => {
		const matchers = /^(\d+)(cm|in)$/i.exec(v);

		if (matchers) {
			const height = parseInt(matchers[1]);

			return matchers[2] === 'cm' ?
				height >= 150 && height <= 193 :
				height >= 59 && height <= 76;
		}

		return false;
	},
	hcl: v => /^#[0-9a-f]{6}$/i.test(v),
	ecl: v => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(v),
	pid: v => v.length === 9
};

function solve1(input) {
	return validate(input, _.keys(validators));
}

function solve2(input) {
	return validate(input, _.keys(validators), validators);
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