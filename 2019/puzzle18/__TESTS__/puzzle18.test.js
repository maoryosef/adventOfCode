'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');
const solver = require('../puzzle18');

const [testInputs, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle 18', () => {
	describe('part 1', () => {
		const testAnswers = [
			8,
			86,
			132,
			136,
			81
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

			expect(res).toBe(2946);
		});
	});

	describe('part 2', () => {
		const testAnswers = [
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			8,
			24,
			32,
			72
		];

		if (testInputs.length > 0 && testAnswers.length > 0) {
			const inputsWithAnswers = _.zip(testInputs, testAnswers).filter(i => i[1] !== undefined);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec2(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(1222);
		});
	});
});
