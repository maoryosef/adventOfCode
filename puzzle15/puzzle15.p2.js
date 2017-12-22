const progress = require('cli-progress');
const readline = require('readline');
const _ = require('lodash');

// create a new progress bar instance and use shades_classic theme
const bar1 = new progress.Bar({
	hideCursor: true
}, progress.Presets.legacy);

const FACTOR_A = 16807;
const FACTOR_B = 48271;
const DIVIDER = 2147483647;
const RUNS = 5000000;
let matches = 0;

function* generateVal(initialVal, factor, multiply) {
	let prevVal = initialVal;
	let count = RUNS;
	while (count) {
		prevVal = (prevVal * factor) % DIVIDER;

		if (prevVal % multiply === 0) {
			count--;
			yield prevVal;
		}
	}
}

let genA = generateVal(591, FACTOR_A, 4);
let genB = generateVal(393, FACTOR_B, 8);

let valA = genA.next().value;
let valB = genB.next().value;

bar1.start(RUNS, 0);
let count = 0;
while (valA && valB) {
	if (`${_.repeat('0', 16)}${valA.toString(2)}`.slice(-16) === `${_.repeat('0', 16)}${valB.toString(2)}`.slice(-16)) {
		readline.moveCursor(process.stdin, 0, 1);
		readline.cursorTo(process.stdin, 0, null);
		process.stdin.write(`found ${++matches} matches`);
		readline.moveCursor(process.stdin, 0, -1);
		readline.cursorTo(process.stdin, 50, null);
	}

	valA = genA.next().value;
	valB = genB.next().value;
	count++;
	bar1.update(count);
}

bar1.update(RUNS);
bar1.stop();
console.log(`found ${matches} matches`);

