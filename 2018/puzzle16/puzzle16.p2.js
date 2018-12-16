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

const OP_MAP = {
	// 0: 'mulr',
	// 1: 'addr',
	// 2: 'banr',
	// 3: 'eqir',
	// 4: 'muli',
	// 5: 'setr',
	// 6: 'eqri',
	// 7: 'gtri',
	// 8: 'eqrr',
	// 9: 'addi',
	// 10: 'gtir',
	// 11: 'gtrr',
	// 12: 'borr',
	// 13: 'bani',
	// 14: 'seti',
	// 15: 'bori',
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

let UNKONWNS = _.keys(INSTRUCTIONS);

tests.forEach(t => {
	const opArgs = t.test.slice(1);
	const opCode = t.test[0];
	let opName = null;

	if (OP_MAP[opCode]) {
		return;
	}

	for (let op of UNKONWNS) {
		setRegisters(...t.before);
		INSTRUCTIONS[op](...opArgs);
		if (registersEqual(...t.after)) {
			opName = op;
			t.matches++;
		}
	}

	if (t.matches === 1) {
		if (OP_MAP[opCode] && OP_MAP[opCode] !== opName) {
			console.error('WHY!!!!!!');
		}

		OP_MAP[opCode] = opName;
		UNKONWNS = _.filter(UNKONWNS, i => _.values(OP_MAP).indexOf(i) === -1);
	}
});

const res = tests.filter(t => t.matches === 1).length;

console.log(res, OP_MAP);

const input2 = fs.readFileSync(`${__dirname}/input.p2.txt`, 'utf-8');

setRegisters(0, 0, 0, 0);

_(input2)
	.split('\n')
	.map(l => l.split(' ').map(v => parseInt(v)))
	.map(a => [OP_MAP[a[0]], a[1], a[2], a[3]])
	.forEach(op =>{
		const opName = op[0];
		const opArgs = op.slice(1);

		INSTRUCTIONS[opName](...opArgs);
	});

console.log(REGISTERS);
console.log('Answer is', REGISTERS[0]);