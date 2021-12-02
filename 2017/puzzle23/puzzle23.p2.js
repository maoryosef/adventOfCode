const fs = require('fs');
const progress = require('cli-progress');

const input = fs.readFileSync(`${__dirname}/input.p2.res.txt`, 'utf-8');

const commands = input.split(/\n/);
const registers = { a: 1, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0 };

const set = (a, b) => { registers[a] = resolveValue(b); };
const sub = (a, b) => { registers[a] = resolveValue(a) - resolveValue(b); };
const mul = (a, b) => { registers[a] = resolveValue(a) * resolveValue(b); };
const mod = (a, b) => { registers[a] = resolveValue(a) % resolveValue(b); };
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
	'jnz': jnz,
	'mod': mod
};

const PARSE_REGEX = /^([^\s]+?)\s+([^\s]+?)(?:\s+([^\s]+)|$)/;

let cursor = 0;

const bar1 = new progress.Bar({
	hideCursor: true,
	barsize: 30,
	format: '[{bar}] {percentage}% {value}/{total} registers {a: {a}, b: {b}, c: {c}, d: {d}, e: {e}, f: {f}, g: {g}, h: {h} } | ETA: {eta}s'
}, progress.Presets.legacy);

bar1.start(17000, 0, registers);

const operationsCache = {};

while (cursor < commands.length) {
	const cmd = commands[cursor];
	let { op, a, b } = operationsCache[cmd] || {};
	if (!op) {
		const tokenized = cmd.match(PARSE_REGEX);
		op = TOKENS[tokenized[1]];
		a = tokenized[2];
		b = tokenized[3];

		operationsCache[cmd] = {
			a,
			b,
			op
		};
	}

	const res = op(a, b);

	if (res) {
		cursor += res;
	} else {
		cursor++;
	}

	bar1.update(registers.b - 109900, registers);
}

bar1.update(17000);
bar1.stop();
console.log(`register h = ${registers.h}`);