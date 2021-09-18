let input = `0: 4
1: 2
2: 3
4: 5
6: 6
8: 6
10: 4
12: 8
14: 8
16: 9
18: 8
20: 6
22: 6
24: 8
26: 12
28: 12
30: 12
32: 10
34: 8
36: 8
38: 10
40: 12
42: 12
44: 12
46: 14
48: 14
50: 14
52: 14
54: 12
56: 12
58: 12
60: 12
62: 14
64: 14
66: 14
68: 14
70: 14
80: 14
82: 14
86: 14
88: 17
94: 30
98: 18`;

// input = `0: 3
// 1: 2
// 4: 4
// 6: 4`;

const rows = input.split(/\n/);
const layers: Record<number, number> = {};
let maxDepth = 0;

rows.forEach(row => {
	const parts = row.split(':');

	const depth = +parts[0].trim();
	const range = parseInt(parts[1].trim(), 10);

	layers[depth] = range;
	maxDepth = Math.max(maxDepth, depth);
});

let penalty = 0;
for (let step = 0; step <= maxDepth; step++) {
	if (layers[step]) {
		const scannerLocation = getLocation(step, layers[step]);

		if (scannerLocation === 0) {
			console.log(step, scannerLocation);
			penalty += step * layers[step];
		}
	}
}

console.log(penalty);

function getLocation(step: number, range: number) {
	const expandedLength = range * 2 - 2;
	expandedLength;
	const mod = step % expandedLength;
	mod;
	range;
	console.log((range - 1) - mod);
	if (mod > range - 1) {
		return (range - 1) + ((range - 1) - mod);
	}

	return mod;
}

export {}