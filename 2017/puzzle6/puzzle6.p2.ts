const input = '10	3	15	10	5	15	5	15	9	2	5	8	5	2	3	6';
const blocks = input.split(/\s/).map(val => parseInt(val, 10));
blocks;

function getLargestBlockIdx(blocksArr: number[]): number {
	let idx: number;
	let max = -Infinity;

	blocksArr.forEach((val, i) => {
		if (val > max) {
			idx = i;
			max = val;
		}
	});

	return idx!;
}

function getPattern(blocksArr: number[]) {
	return blocksArr.join(',');
}

const seenPatterns: Record<string, number> = {};

let pattern = getPattern(blocks);
let steps = 0;
while (seenPatterns[pattern] === undefined) {
	seenPatterns[pattern] = steps;
	steps++;

	const largestBlockIdx = getLargestBlockIdx(blocks);
	const largestBlockVal = blocks[largestBlockIdx];

	blocks[largestBlockIdx] = 0;

	let blockIdx = largestBlockIdx + 1;
	if (blockIdx === blocks.length) {
		blockIdx = 0;
	}

	for (let i = 0; i < largestBlockVal; i++) {
		blocks[blockIdx]++;

		blockIdx++;

		if (blockIdx === blocks.length) {
			blockIdx = 0;
		}
	}

	pattern = getPattern(blocks);
}

pattern;
steps;
console.log(steps - seenPatterns[pattern]);

export {}