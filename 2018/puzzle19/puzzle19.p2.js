'use strict';
const fs = require('fs');
const _ = require('lodash');

const progress = require('cli-progress');

const bar1 = new progress.Bar({
	hideCursor: true,
	barsize: 30,
	format: '[{bar}] {percentage}% {value}/{total} {0: {a}, 1: {b}, 2: {c}, 3: {d}, 4: {e}, 5: {f} }| ETA: {eta}s'
}, progress.Presets.legacy);

const REGISTERS = {
	0: 1,
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

while (REGISTERS[ip] !== 1) {
	const inst = ops[REGISTERS[ip]];
	INSTRUCTIONS[inst[0]](...inst[1]);
	REGISTERS[ip]++;
}

const num = REGISTERS[5];
bar1.start(num);

let count = 0;
for (let i = 0; i <= num; i++) {
	if (num % i === 0) {
		count += i;
	}

	if (i % 1000 === 0) {
		bar1.update(i);
	}
}

bar1.update(num);
bar1.stop();

console.log(count);