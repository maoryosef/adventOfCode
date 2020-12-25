'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const solver = require('../puzzle15');

const [, realInput] = _(__dirname)
	.thru(fs.readdirSync)
	.filter(f => path.extname(f) === '.txt')
	.partition(f => _.includes(f, 'test'))
	.value();

const getPath = filename => `${__dirname}/${filename}`;

describe('puzzle 15', () => {
	describe('part 1', () => {
		test('real input', () => {
			const res = solver.exec1(getPath(realInput[0]));

			expect(res).toBe(18965440);
		});
	});

	describe('part 2', () => {
		test('real input', () => {
			const res = solver.exec2(getPath(realInput[0]));

			expect(res).toBe(15862900);
		});
	});
});
