'use strict';

const fs = require('fs');
const _ = require('lodash');
const {drawAscii} = require('../../utils/drawUtils');

const {runProgram, parseProgram} = require('../intCodeRunner');

function solve(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	function generateProgramIO() {
		const intersections = [];
		const map = [[]];
		const pos = {x: 0, y: 0};

		function onOutput(output) {
			const outputChar = String.fromCharCode(output);

			if (output === 10) {
				map.push([]);
				pos.x = 0;
				pos.y++;
				return;
			}

			map[pos.y].push(outputChar);
			pos.x++;

			if (outputChar === '#') {
				if (intersectionCreated()) {
					intersections.push({x: pos.x - 1, y: pos.y - 1});
					map[pos.y - 1][pos.x - 1] = 'O';
				}
			}
		}

		function getIntersections() {
			return intersections;
		}

		function intersectionCreated() {

			let testPositions = [
				{y: pos.y - 1, x: pos.x - 1},
				{y: pos.y - 2, x: pos.x - 1},
				{y: pos.y - 1, x: pos.x},
				{y: pos.y - 1, x: pos.x - 2},
			];

			return testPositions.every(({x, y}) => _.get(map, [y, x]) === '#');
		}

		return {
			onOutput,
			getMap() { return map; },
			getIntersections
		};
	}

	const program = parseProgram(input);
	const {onOutput, getIntersections, onInputRequest, getMap} = generateProgramIO();

	runProgram([], program, {
		onInputRequest,
		onOutput
	});

	const intersections = getIntersections();
	const res = intersections.reduce((acc, {x, y}) => {
		acc += x * y;
		return acc;
	}, 0);

	const map = getMap();

	console.log(drawAscii(map, map[0].length, map.length, true));

	return res;
}

console.log(solve(__dirname + '/__TESTS__/input.txt'));
module.exports = {
	solve
};