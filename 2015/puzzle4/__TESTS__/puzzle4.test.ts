import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import solver from '../puzzle4';

const [, realInput] = _(__dirname)
	.thru((dir: string) => fs.readdirSync(dir))
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = (filename: string) => `${__dirname}/${filename}`;

describe('puzzle 4', () => {
	describe('part 1', () => {
		test('real input', () => {
			const res = solver.exec1(getPath(realInput[0]));

			expect(res).toBe(346386);
		});
	});

	describe('part 2', () => {
		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(9958218);
		});
	});
});
