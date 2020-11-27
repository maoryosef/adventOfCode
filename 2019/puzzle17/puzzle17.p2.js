'use strict';

const fs = require('fs');
const _ = require('lodash');
const {runProgram, parseProgram} = require('../intCodeRunner');

function getNextStep({x, y, d}) {
	switch (d) {
		case '^': return {x, y: y - 1};
		case 'v': return {x, y: y + 1};
		case '>': return {x: x + 1, y};
		case '<': return {x: x - 1, y};
	}
}

function getNewDir(dir, r) {
	switch(dir) {
		case '^': return r === 'R' ? '>' : '<';
		case 'v': return r === 'R' ? '<' : '>';
		case '>': return r === 'R' ? 'v' : '^';
		case '<': return r === 'R' ? '^' : 'v';
	}
}

function turnAndCheck(pos, rotate, map) {
	let newDir = getNewDir(pos.d, rotate);
	let nextStep = getNextStep({...pos, d: newDir});

	if (_.get(map, [nextStep.y, nextStep.x], '.') !== '.') {
		return {
			newVPos: {...pos, d: newDir},
			turnDir: rotate
		};
	}
}

const turnVaccum = (pos, map) => turnAndCheck(pos, 'L', map) || turnAndCheck(pos, 'R', map) || {};

function getCommandsSequence(vPos, map) {
	const commands = [];
	let steps = 0;

	do {
		let nextStep = getNextStep(vPos);

		if (_.get(map, [nextStep.y, nextStep.x], '.') !== '.') {
			vPos = {...nextStep, d: vPos.d};
			steps++;
		} else {
			if (steps) {
				commands.push(steps);
				steps = 0;
			}

			const {newVPos, turnDir} = turnVaccum(vPos, map);

			if (turnDir) {
				commands.push(turnDir);
				vPos = newVPos;
				nextStep = getNextStep(vPos);

				if (_.get(map, [nextStep.y, nextStep.x], '.') !== '.') {
					vPos = {...nextStep, d: vPos.d};
					steps++;
				}
			}
		}
	} while(steps > 0);

	return commands;
}

function solve(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	function generateProgramIO() {
		const map = [[]];
		const pos = {x: 0, y: 0};
		let vPos;

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

			if (['^', 'v', '<', '>'].includes(outputChar)) {
				vPos = {x: pos.x - 1, y: pos.y, d: outputChar};
			}
		}

		return {
			onOutput,
			getMap() { return map; },
			getVPos() { return vPos; }
		};
	}

	const originalProgram = parseProgram(input);
	let program = originalProgram.slice(0);
	const {onOutput, onInputRequest, getMap, getVPos} = generateProgramIO();

	runProgram([], program, {
		onInputRequest,
		onOutput
	});

	const map = getMap();
	let vPos = getVPos();

	const commands = getCommandsSequence(vPos, map);
	console.log(commands.join(','));
	/**
	 *
		A - R,6,L,6,L,10
		B - L,8,L,6,L,10,L,6
		C - R,6,L,8,L,10,R,6

		A,B,A,B,C,A,B,C,A,C
	 */

	const sequence = 'A,B,A,B,C,A,B,C,A,C'.split('').map(c => c.charCodeAt(0)).concat(10);
	const patternA = 'R,6,L,6,L,10'.split('').map(c => c.charCodeAt(0)).concat(10);
	const patternB = 'L,8,L,6,L,10,L,6'.split('').map(c => c.charCodeAt(0)).concat(10);
	const patternC = 'R,6,L,8,L,10,R,6'.split('').map(c => c.charCodeAt(0)).concat(10);

	program = originalProgram.slice(0);
	program[0] = 2;

	const res = runProgram([...sequence, ...patternA, ...patternB, ...patternC, 'n'.charCodeAt(0), 10], program);

	return res;
}

// (function() {
// 	const input = 'R,6,L,6,L,10,L,8,L,6,L,10,L,6,R,6,L,6,L,10,L,8,L,6,L,10,L,6,R,6,L,8,L,10,R,6,R,6,L,6,L,10,L,8,L,6,L,10,L,6,R,6,L,8,L,10,R,6,R,6,L,6,L,10,R,6,L,8,L,10,R,6'.split(',');
// 	const inputStr = input.join('');
// 	const originalInput = input.slice(0);

// 	let currentSeq = '';
// 	let idx = 0;
// 	let start = 0;
// 	while (input.length) {
// 		const nextChar = input.shift();

// 		idx++;
// 		if (inputStr.indexOf(currentSeq + nextChar, idx) > -1) {
// 			currentSeq += nextChar;
// 		} else {
// 			console.log('found seq', start, idx, currentSeq);
// 			console.log(originalInput.slice(start, idx).join(','));
// 			currentSeq = '';
// 			start = idx = idx + 1;
// 		}
// 	}

// 	console.log(currentSeq);
// })();
module.exports = {
	solve
};