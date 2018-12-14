'use strict';
const recepies = [3, 7];

let elf1Idx = 0;
let elf2Idx = 1;

const INPUT = 990941;
while (recepies.length < INPUT + 10) {
	const val = recepies[elf1Idx] + recepies[elf2Idx];
	const tens = Math.trunc(val / 10);
	const singles = val % 10;

	if (tens) {
		recepies.push(tens);
	}

	recepies.push(singles);

	elf1Idx = (elf1Idx + recepies[elf1Idx] + 1) % recepies.length;
	elf2Idx = (elf2Idx + recepies[elf2Idx] + 1) % recepies.length;
}

console.log(recepies.slice(INPUT, INPUT + 10).join(''));