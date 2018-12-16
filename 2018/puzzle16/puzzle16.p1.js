'use strict';
const fs = require('fs');
const _ = require('lodash');

const REGISTERS = {
	0: 0,
	1: 0,
	2: 0,
	3: 0
};

const INSTRUCTIONS = {
	addr: (r1, r2, r3) => {REGISTERS[r3] = REGISTERS[r1] + REGISTERS[r2];},
	addi: (r1, v, r3) => {REGISTERS[r3] = REGISTERS[r1] + v;},
	mulr: (r1, r2, r3) => {REGISTERS[r3] = REGISTERS[r1] * REGISTERS[r2];},
	muli: (r1, v, r3) => {REGISTERS[r3] = REGISTERS[r1] * v;},
	banr: (r1, r2, r3) => {REGISTERS[r3] = REGISTERS[r1] & REGISTERS[r2];},
	bani: (r1, v, r3) => {REGISTERS[r3] = REGISTERS[r1] & v;},
	borr: (r1, r2, r3) => {REGISTERS[r3] = REGISTERS[r1] | REGISTERS[r2];},
	bori: (r1, v, r3) => {REGISTERS[r3] = REGISTERS[r1] | v;},
	setr: (r1, r2, r3) => {REGISTERS[r3] = REGISTERS[r1];},
	seti: (v, r2, r3) => {REGISTERS[r3] = v;},
	gtir: (v, r2, r3) => {REGISTERS[r3] = v > REGISTERS[r2] ? 1 : 0;},
	gtri: (r1, v, r3) => {REGISTERS[r3] = REGISTERS[r1] > v ? 1 : 0;},
	gtrr: (r1, r2, r3) => {REGISTERS[r3] = REGISTERS[r1] > REGISTERS[r2] ? 1 : 0;},
	eqir: (v, r2, r3) => {REGISTERS[r3] = v === REGISTERS[r2] ? 1 : 0;},
	eqri: (r1, v, r3) => {REGISTERS[r3] = REGISTERS[r1] === v ? 1 : 0;},
	eqrr: (r1, r2, r3) => {REGISTERS[r3] = REGISTERS[r1] === REGISTERS[r2] ? 1 : 0;},
};

function setRegisters(r0, r1, r2, r3) {
	REGISTERS[0] = r0;
	REGISTERS[1] = r1;
	REGISTERS[2] = r2;
	REGISTERS[3] = r3;
}

function registersEqual(r0, r1, r2, r3) {
	return REGISTERS[0] === r0 &&
		REGISTERS[1] === r1 &&
		REGISTERS[2] === r2 &&
		REGISTERS[3] === r3;
}

const input = fs.readFileSync(`${__dirname}/input.p1.txt`, 'utf-8');
const tests = [];
let currentTest = 0;

_(input)
	.split('\n')
	.compact()
	.forEach(line => {
		if (_.startsWith(line, 'Before:')) {
			const parts = line.split('[')[1].split(']')[0].split(',').map(v => parseInt(v));
			tests[currentTest] = {
				before: parts,
				matches: 0
			};
		} else if (_.startsWith(line, 'After:')) {
			const parts = line.split('[')[1].split(']')[0].split(',').map(v => parseInt(v));
			tests[currentTest].after = parts;
			currentTest++;
		} else {
			tests[currentTest].test = line.split(' ').map(v => parseInt(v));
		}
	});

tests.forEach(t => {
	const opArgs = t.test.slice(1);

	for (let op in INSTRUCTIONS) {
		setRegisters(...t.before);
		INSTRUCTIONS[op](...opArgs);
		if (registersEqual(...t.after)) {
			t.matches++;
		}
	}
});

const res = tests.filter(t => t.matches > 2).length;

console.log(res);
