'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');
const Combinatorics = require('js-combinatorics');

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

function getArgs(program, idx, argsState) {
	const [argPos1, argPos2] = argsState;

	const arg1 = argPos1 ? program[idx + 1] : program[program[idx + 1]];
	const arg2 = argPos2 ? program[idx + 2] : program[program[idx + 2]];
	const out = program[idx + 3];

	return {out, arg1, arg2};
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

	const waitForInput = () => new Promise(res => {notifyOnInput = res;});

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
			const {out, arg1, arg2} = getArgs(program, opIndex, args);

			let next = 1;
			switch (action) {
				case 1: program[out] = arg1 + arg2; next = 4; break;
				case 2: program[out] = arg1 * arg2; next = 4; break;
				case 3: {
					const out = program[opIndex + 1];
					program[out] = await getInput();
					next = 2;
					break;
				}
				case 4: {
					output = arg1;
					nextAmp.signal(arg1);
					next = 2;
					break;
				}
				case 5: {
					if (arg1 !== 0) {
						opIndex = arg2;
						next = 0;
					} else {
						next = 3;
					}
					break;
				}
				case 6: {
					if (arg1 === 0) {
						opIndex = arg2;
						next = 0;
					} else {
						next = 3;
					}
					break;
				}
				case 7: {
					if (arg1 < arg2) {
						program[out] = 1;
					} else {
						program[out] = 0;
					}
					next = 4;
					break;
				}
				case 8: {
					if (arg1 === arg2) {
						program[out] = 1;
					} else {
						program[out] = 0;
					}
					next = 4;
					break;
				}
				default:
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
	let largestOutput = -Infinity;

	const permutations = Combinatorics.permutation([5, 6, 7, 8, 9]).toArray();

	for (let inputArray of permutations) {
		const output = await runOnInput(inputArray);
		if (output > largestOutput) {
			largestOutput = output;
		}
	}

	return largestOutput;
}

findLargest().then(res => {
	console.log(res);
});
