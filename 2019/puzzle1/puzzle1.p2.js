'use strict';

const TEST_MODE=process.env.TESTING;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const calculateMass = num => Math.floor(num / 3) - 2;

const calculateTotalMass = num => {
	const newMass = calculateMass(num);

	if (newMass < 1) {
		return [];
	}

	return [newMass, ...calculateTotalMass(newMass)];
};

const res = _(input)
	.split('\n')
	.map(num => parseInt(num))
	.flatMap(calculateTotalMass)
	.reduce((acc, val) => acc + val, 0);

console.log(res);
