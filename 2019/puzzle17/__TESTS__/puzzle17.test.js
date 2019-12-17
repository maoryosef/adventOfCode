'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');
const solverP1 = require('../puzzle17.p1');
const solverP2 = require('../puzzle17.p2');

const [testInputs, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle 17', () => {
	describe('part 1', () => {
		if (testInputs.length > 0) {
			const answers = [
			];

			const inputsWithAnswers = _.zip(testInputs, answers);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solverP1.solve(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solverP1.solve(getPath(realInput[0]));

			expect(res).toBe(1544);
		});
	});

	describe('part 2', () => {
		if (testInputs.length > 0) {
			const answers = [
			];

			const inputsWithAnswers = _.zip(testInputs, answers);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solverP2.solve(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solverP2.solve(getPath(realInput[0]));

			expect(res).toBe(true);
		});
	});
});
