const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const commands = input.split(/\n/);
const registers = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0 };

const set = (a, b) => { registers[a] = resolveValue(b); };
const sub = (a, b) => { registers[a] = resolveValue(a) - resolveValue(b); };
const mul = (a, b) => { registers[a] = resolveValue(a) * resolveValue(b); };
const jnz = (a, b) => resolveValue(a) !== 0 ? resolveValue(b) : 0;

function resolveValue(val) {
	const asNumber = parseInt(val, 10);
	if (!isNaN(asNumber)) {
		return asNumber;
	}

	registers[val] = registers[val] || 0;

	return registers[val];
}

const TOKENS = {
	'set': set,
	'sub': sub,
	'mul': mul,
	'jnz': jnz
};

const PARSE_REGEX = /^([^\s]+?)\s+([^\s]+?)(?:\s+([^\s]+)|$)/;

let cursor = 0;
let mulCounter = 0;

while (cursor < commands.length) {
	const cmd = commands[cursor];
	const tokenized = cmd.match(PARSE_REGEX);
	const operand = tokenized[1];
	const a = tokenized[2];
	const b = tokenized[3];

	const res = TOKENS[operand](a, b);

	if (operand === 'mul') {
		mulCounter++;
	}

	if (res) {
		cursor += res;
	} else {
		cursor++;
	}
}

console.log(`mul called ${mulCounter} times`);