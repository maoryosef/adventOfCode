'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');
const solverP1 = require('../puzzle16.p1');
const solverP2 = require('../puzzle16.p2');

const [testInputs, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle 16', () => {
	describe('part 1', () => {
		if (testInputs.length > 0) {
			const answers = [
				'23845678', //for 100 runs, 01029498 was for 4
				'24176176',
				'73745418',
				'52432133'
			];

			const inputsWithAnswers = _.zip(testInputs, answers);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solverP1.solve(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solverP1.solve(getPath(realInput[0]));

			expect(res).toBe('70856418');
		});
	});

	describe('part 2', () => {
		const inputsWithAnswers = [
			['03036732577212944063491565474664', '84462026'],
			['02935109699940807407585447034323', '78725270'],
			['03081770884921959731165446850517', '53553731'],
		];

		each(inputsWithAnswers).test('test case %s should be [%s]', (testInput, expected) => {
			const res = solverP2.solve(null, testInput);

			expect(res).toBe(expected);
		});

		test('real input', () => {
			const res = solverP2.solve(getPath(realInput[0]));

			expect(res).toBe('87766336');
		});
	});
});
