'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const codes = _(input)
	.split(',')
	.map(num => parseInt(num))
	.value();

function parseOp(op) {
	let tempOp = Math.trunc(op / 100);
	const action = op % 100;

	const args = [];
	while (tempOp) {
		args.push(tempOp % 10);
		tempOp = Math.trunc(tempOp / 10);
	}

	return {
		args,
		action
	};
}

function createAmp(programSource, phaseSetting) {
	const program = programSource.slice(0);
	let opIndex = 0;
	let nextAmp = null;
	const signalQueue = [phaseSetting];
	let started = false;
	let notifyOnInput = null;
	let onDoneCallback = null;

	function onSignal(signal) {
		signalQueue.push(signal);
		notifyOnInput();
	}

	const waitForInput = async () => new Promise(res => {notifyOnInput = res;});

	async function getInput() {
		if (signalQueue.length === 0) {
			await waitForInput();
		}

		return signalQueue.shift(1);
	}

	async function start(value) {
		let output = null;
		signalQueue.push(value);
		started = true;

		while (program[opIndex] !== 99) {
			const {action, args} = parseOp(program[opIndex]);

			let next = 1;
			if (action === 1) {
				const [argPos1, argPos2] = args;

				const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
				const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];
				const out = program[opIndex + 3];

				program[out] = arg1 + arg2;
				next = 4;
			} else if (action === 2) {
				const [argPos1, argPos2] = args;

				const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
				const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];
				const out = program[opIndex + 3];

				program[out] = arg1 * arg2;
				next = 4;
			} else if (action === 3) {
				const out = program[opIndex + 1];
				program[out] = await getInput();
				next = 2;
			} else if (action === 4) {
				const [argPos1] = args;
				const out = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];

				output = out;
				nextAmp.signal(out);
				next = 2;
			} else if (action === 5) {
				const [argPos1, argPos2] = args;
				const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
				const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];

				if (arg1 !== 0) {
					opIndex = arg2;
					next = 0;
				} else {
					next = 3;
				}
			} else if (action === 6) {
				const [argPos1, argPos2] = args;
				const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
				const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];

				if (arg1 === 0) {
					opIndex = arg2;
					next = 0;
				} else {
					next = 3;
				}
			} else if (action === 7) {
				const [argPos1, argPos2] = args;
				const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
				const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];
				const out = program[opIndex + 3];

				if (arg1 < arg2) {
					program[out] = 1;
				} else {
					program[out] = 0;
				}
				next = 4;
			} else if (action === 8) {
				const [argPos1, argPos2] = args;
				const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
				const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];
				const out = program[opIndex + 3];

				if (arg1 === arg2) {
					program[out] = 1;
				} else {
					program[out] = 0;
				}
				next = 4;
			} else {
				throw new Error(`unexpected op, ${action}, at index, ${opIndex}`);
			}

			opIndex += next;
		}

		_.invoke(onDoneCallback, 'call', null, output);
	}

	return {
		signal(value) {
			if (!started) {
				start(value);
			} else {
				onSignal(value);
			}
		},
		next(amp) {
			nextAmp = amp;
		},
		onDone(cb) {
			onDoneCallback = cb;
		}
	};
}

const BASE=10;
const LOWER_BASE = 5;
function incInput(inputArray) {
	let carry = 0;
	let idx = inputArray.length - 1;

	inputArray[idx]++;

	while (idx > -1) {
		inputArray[idx] += carry;

		if (inputArray[idx] === BASE) {
			carry = 1;
			inputArray[idx] = LOWER_BASE;
		} else {
			carry = 0;
		}

		idx--;
	}
}

function runOnInput(phaseSettings) {
	const ampA = createAmp(codes, phaseSettings[0]);
	const ampB = createAmp(codes, phaseSettings[1]);
	const ampC = createAmp(codes, phaseSettings[2]);
	const ampD = createAmp(codes, phaseSettings[3]);
	const ampE = createAmp(codes, phaseSettings[4]);

	ampA.next(ampB);
	ampB.next(ampC);
	ampC.next(ampD);
	ampD.next(ampE);
	ampE.next(ampA);

	return new Promise(res => {
		ampE.onDone(res);
		ampA.signal(0);
	});
}

async function findLargest() {
	const inputArray = [5, 5, 5, 5, 5];

	let largestOutput = -Infinity;

	do {
		incInput(inputArray);

		const inputSet = new Set(inputArray);
		if (inputSet.size !== 5) {
			continue;
		}

		const output = await runOnInput(inputArray);
		if (output > largestOutput) {
			largestOutput = output;
		}
	} while (inputArray.join('') !== '55555');

	return largestOutput;
}

findLargest().then(res => {
	console.log(res);
});