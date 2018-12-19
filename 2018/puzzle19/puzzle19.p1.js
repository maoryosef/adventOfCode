'use strict';
const fs = require('fs');
const _ = require('lodash');

const REGISTERS = {
	0: 0,
	1: 0,
	2: 0,
	3: 0,
	4: 0,
	5: 0
};

let ip = null;

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

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const ops = [];

_(input)
	.split('\n')
	.forEach(l => {
		if (_.startsWith(l, '#ip')) {
			ip = parseInt(l.split(' ')[1]);
		} else {
			const [op, ...args] = l.split(' ');
			ops.push([op, args.map(v => parseInt(v))]);
		}
	});

while (REGISTERS[ip] < ops.length) {
	const inst = ops[REGISTERS[ip]];
	INSTRUCTIONS[inst[0]](...inst[1]);
	REGISTERS[ip]++;
}

console.log(REGISTERS);
