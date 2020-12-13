'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');
const solver = require('../puzzle13');

const [testInputs, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle 13', () => {
	describe('part 1', () => {
		if (testInputs.length > 0) {
			const answers = [
				295
			];

			const inputsWithAnswers = _.zip(testInputs, answers).filter(i => !!i[1]);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec1(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec1(getPath(realInput[0]));

			expect(res).toBe(2095);
		});
	});

	describe('part 2', () => {
		if (testInputs.length > 0) {
			const answers = [
				1068781,
				3417,
				754018,
				779210,
				1261476,
				1202161486
			];

			const inputsWithAnswers = _.zip(testInputs, answers);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec2(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(598411311431841);
		});
	});
});
