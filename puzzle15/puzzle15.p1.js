const progress = require('cli-progress');
const readline = require('readline');
const _ = require('lodash');

// create a new progress bar instance and use shades_classic theme
const bar1 = new progress.Bar({
	barCompleteChar: '\u2588',
	barIncompleteChar: '\u2591',
	hideCursor: true
}, progress.Presets.legacy);

let genAprevVal = 591;
let genBprevVal = 393;
const FACTOR_A = 16807;
const FACTOR_B = 48271;
const DIVIDER = 2147483647;
const RUNS = 40000000;
let matches = 0;

bar1.start(RUNS, 0);
for (let i = 0; i < RUNS; i++) {
	if (`${_.repeat('0', 16)}${genAprevVal.toString(2)}`.slice(-16) === `${_.repeat('0', 16)}${genBprevVal.toString(2)}`.slice(-16)) {
		readline.moveCursor(process.stdin, 0, 1);
		readline.cursorTo(process.stdin, 0, null);
		process.stdin.write(`found ${++matches} matches`);
		readline.moveCursor(process.stdin, 0, -1);
		readline.cursorTo(process.stdin, 50, null);
	}

	genAprevVal = (genAprevVal * FACTOR_A) % DIVIDER;
	genBprevVal = (genBprevVal * FACTOR_B) % DIVIDER;

	if (i % 100 === 0) {
		bar1.update(i);
	}
}

bar1.update(RUNS);
bar1.stop();
console.log(`found ${matches} matches`);
