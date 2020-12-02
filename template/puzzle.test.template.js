'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');
const solverP1 = require('../puzzle<PNUM>.p1');
const solverP2 = require('../puzzle<PNUM>.p2');

const [testInputs, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle <PNUM>', () => {
	describe('part 1', () => {
		if (testInputs.length > 0) {
			const answers = [
			];

			const inputsWithAnswers = _.zip(testInputs, answers);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solverP1.exec(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test.skip('real input', () => {
			const res = solverP1.exec(getPath(realInput[0]));

			expect(res).toBe(true);
		});
	});

	xdescribe('part 2', () => {
		if (testInputs.length > 0) {
			const answers = [
			];

			const inputsWithAnswers = _.zip(testInputs, answers);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solverP2.exec(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test.skip('real input', () => {
			const res = solverP2.exec(getPath(realInput[0]));

			expect(res).toBe(true);
		});
	});
});
