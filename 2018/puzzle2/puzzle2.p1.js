'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

function countAppearences(line) {
	const appearences = {};
	const splitted = line.split('');

	splitted.forEach(c => {
		if (_.isNil(appearences[c])) {
			appearences[c] = 0;
		}

		appearences[c] += 1;
	});

	return [
		_.values(_.pickBy(appearences, a => a === 2)).length > 0 ? 1 : 0,
		_.values(_.pickBy(appearences, a => a === 3)).length > 0 ? 1 : 0
	];
}

const res = _(input)
	.split('\n')
	.map(countAppearences)
	.reduce((acc, [twos, threes]) => {
		acc[0] += twos;
		acc[1] += threes;

		return acc;
	}, [0, 0]);

console.log(res[0] * res[1], '=', 5390);