'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');
const solver = require('../puzzle7');

const [testInputs, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle 7', () => {
	describe('part 1', () => {
		if (testInputs.length > 0) {
			const answers = [
				4,
				0
			];

			const inputsWithAnswers = _.zip(testInputs, answers);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec1(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec1(getPath(realInput[0]));

			expect(res).toBe(139);
		});
	});

	describe('part 2', () => {
		if (testInputs.length > 0) {
			const answers = [
				32,
				126
			];

			const inputsWithAnswers = _.zip(testInputs, answers);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec2(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(58175);
		});
	});
});
