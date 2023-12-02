'use strict';

const fs = require('fs');
const path = require('path');
const each = require('jest-each').default;
const _ = require('lodash');

function initTests(puzzleDirname, {exec1, testCases1, expectedRes1, exec2, testCases2, expectedRes2}) {
	const [testInputs, realInput] = _(puzzleDirname)
		.thru(fs.readdirSync)
		.filter(f => path.extname(f) === '.txt')
		.partition(f => _.includes(f, 'test'))
		.value();

	const getPath = filename => `${puzzleDirname}/${filename}`;

	describe.each([
		['part 1', exec1, testCases1, expectedRes1],
		['part 2', exec2, testCases2, expectedRes2],
	])('%s', (_d, solver, testCases, expectedRes) => {
		if (testInputs.length > 0 && testCases.length > 0) {
			const inputsWithAnswers = _.zip(testInputs, testCases).filter(i => i[1] !== undefined);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test(`real input should be [${expectedRes}]`, () => {
			const res = solver(getPath(realInput[0]));

			expect(res).toBe(expectedRes);
		});
	});
}

module.exports = {
	initTests
};