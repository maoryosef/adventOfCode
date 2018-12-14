'use strict';

const head = {
	val: 3,
	prev: null,
	next: null
};

let tail = {
	val: 7,
	prev: head,
	next: head
};

head.prev = tail;
head.next = tail;

let elf1 = head;
let elf2 = tail;

const RUNS = 15497789;

for (let i = 0; i < RUNS; i++) {
	const val = elf1.val + elf2.val;
	const tens = Math.trunc(val / 10);
	const singles = val % 10;

	if (tens) {
		const newVal = {
			val: tens,
			next: head,
			prev: tail
		};

		tail.next = newVal;
		head.prev = newVal;
		tail = newVal;
	}

	const newVal = {
		val: singles,
		next: head,
		prev: tail
	};

	tail.next = newVal;
	head.prev = newVal;
	tail = newVal;

	let steps = elf1.val + 1;
	for (let x = 0; x < steps; x++) {
		elf1 = elf1.next;
	}

	steps = elf2.val + 1;
	for (let x = 0; x < steps; x++) {
		elf2 = elf2.next;
	}
}

const SEARCH_INPUT = '990941';
const input = (SEARCH_INPUT).split('').map(n => parseInt(n));
let foundIdx = 0;

tail.next = null;
let it = head;
let idx = 0;

while (it && foundIdx < input.length) {
	if (it.val === input[foundIdx]) {
		foundIdx++;
	} else if (it.val === input[0]) {
		foundIdx = 1;
	} else {
		foundIdx = 0;
	}

	it = it.next;
	idx++;
}

if (foundIdx) {
	console.log(idx - foundIdx);
} else {
	console.log('didnt find after ', RUNS);
}