const progress = require('cli-progress');
const steps = 363;
let currentPos = 0;
const RUNS = 50000000;
let lastNum = null;

const bar1 = new progress.Bar({
	hideCursor: true
}, progress.Presets.legacy);

bar1.start(RUNS, 0);

for (let i = 1; i < RUNS + 1; i++) {
	currentPos = (currentPos + 1 + steps) % i;

	if (currentPos === 0) {
		lastNum = i;
	}

	if (i % 1000 === 0) {
		bar1.update(i);
	}
}

bar1.update(RUNS);
bar1.stop();

console.log(lastNum);
