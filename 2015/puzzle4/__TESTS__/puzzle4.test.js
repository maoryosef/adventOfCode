'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const solver = require('../puzzle4');

const [, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

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
