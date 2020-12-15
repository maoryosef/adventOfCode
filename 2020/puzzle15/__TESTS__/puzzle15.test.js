'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');
const solver = require('../puzzle15');

const [testInputs, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle 15', () => {
	describe('part 1', () => {
		if (testInputs.length > 0) {
			const answers = [
				436
			];

			const inputsWithAnswers = _.zip(testInputs, answers).filter(i => !!i[1]);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec1(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec1(getPath(realInput[0]));

			expect(res).toBe(981);
		});
	});

	describe('part 2', () => {
		if (testInputs.length > 0) {
			const answers = [
				175594
			];

			const inputsWithAnswers = _.zip(testInputs, answers).filter(i => !!i[1]);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec2(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(164878);
		});
	});
});
