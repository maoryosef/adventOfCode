'use strict';

const { initTests } = require('../../../utils/testUtils');
const puzzle = require('../puzzle5');

const toRangesAdapter = (value, map) => puzzle.toRanges({'test': map}, 'test')(value);

describe('puzzle 5', () => {
	describe('toRanges', () => {
		it('should split seeds according to ranges', () => {
			expect(toRangesAdapter([[79, 20]], [
				[50, 50, 10],
				[60, 60, 25],
				[85, 85, 10],
				[95, 95, 14]
			])).toEqual([
				[79, 6],
				[85, 10],
				[95, 4]
			]);
		});

		it('should split seeds and add the offset', () => {
			expect(toRangesAdapter([[79, 20]], [
				[40, 50, 10],
				[70, 60, 25],
				[75, 85, 10],
				[85, 95, 14]
			])).toEqual([
				[89, 6],
				[75, 10],
				[85, 4]
			]);
		});

		it('should handle gaps in the middle of the range', () => {
			expect(toRangesAdapter([[79, 20]], [
				[40, 50, 10],
				[70, 60, 25],
				[85, 95, 14]
			])).toEqual([
				[89, 6],
				[85, 10],
				[85, 4]
			]);
		});

		it('should handle multiple gaps in the middle of the range', () => {
			expect(toRangesAdapter([[79, 20]], [
				[50, 50, 10],
				[60, 60, 25],
				[88, 88, 2],
				[95, 95, 14]
			])).toEqual([
				[79, 6],
				[85,3],
				[88,2],
				[90, 5],
				[95, 4]
			]);
		});

		it('should handle missing edges', () => {
			expect(toRangesAdapter([[79, 20]], [
				[82, 82, 10]
			])).toEqual([
				[79, 3],
				[82,10],
				[92, 7]
			]);
		});

		it('should handle no intersecting range', () => {
			expect(toRangesAdapter([[79, 20]], [
				[60, 60, 10]
			])).toEqual([
				[79, 20],
			]);
		});
	});

	initTests(__dirname, puzzle);
});
