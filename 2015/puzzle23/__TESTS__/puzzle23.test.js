'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');
const solver = require('../puzzle23');

const [testInputs, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle 23', () => {
	describe('part 1', () => {
		const testAnswers = [
			0
		];

		if (testInputs.length > 0 && testAnswers.length > 0) {
			const inputsWithAnswers = _.zip(testInputs, testAnswers).filter(i => i[1] !== undefined);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec1(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec1(getPath(realInput[0]));

			expect(res).toBe(184);
		});
	});

	describe('part 2', () => {
		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(231);
		});
	});
});
