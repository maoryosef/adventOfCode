import fs from 'fs';
import path from 'path';
import each from 'jest-each';
import _ from 'lodash';
import solver from '../puzzle3';

const [testInputs, realInput] = _(__dirname)
	.thru((dir: string) => fs.readdirSync(dir))
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = (filename: string) => `${__dirname}/${filename}`;

describe('puzzle 3', () => {
	describe('part 1', () => {
		if (testInputs.length > 0) {
			const answers = [
				2
			];

			const inputsWithAnswers = _.zip(testInputs, answers).filter(i => !!i[1]);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec1(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec1(getPath(realInput[0]));

			expect(res).toBe(2592);
		});
	});

	describe('part 2', () => {
		if (testInputs.length > 0) {
			const answers = [
				11
			];

			const inputsWithAnswers = _.zip(testInputs, answers).filter(i => !!i[1]);

			each(inputsWithAnswers).test('test case %s should be [%s]', (testInputFilename, expected) => {
				const res = solver.exec2(getPath(testInputFilename));

				expect(res).toBe(expected);
			});
		}

		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(2360);
		});
	});
});
