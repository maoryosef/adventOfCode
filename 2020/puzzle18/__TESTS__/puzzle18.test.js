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
		if (testInputs.length > 0) {
			const answers = [
				71 + 26 + 437 + 12240 + 13632
			];

			const inputsWithAnswers = _.zip(testInputs, answers).filter(i => !!i[1]);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec1(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec1(getPath(realInput[0]));

			expect(res).toBe(209335026987);
		});
	});

	describe('part 2', () => {
		if (testInputs.length > 0) {
			const answers = [
				undefined,
				51 + 46 + 1445 + 669060 + 23340
			];

			const inputsWithAnswers = _.zip(testInputs, answers).filter(i => !!i[1]);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec2(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(33331817392479);
		});
	});
});
