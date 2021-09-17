import fs from 'fs';
import _ from 'lodash';

const AND_OR_COMMAND = /^(.*?) (AND|OR) (.*?)$/;
const SHIFT_COMMAND = /^(.*?) ([LR]SHIFT) (.*?)$/;
const NOT_COMMAND = /^NOT (.*?)$/;

function parseRow(row: string) {
	const [valueRaw, v] = row.split(' -> ');

	let value, opVal, deps = [], op = 'VALUE';

	if (/^\d+$/.test(valueRaw)) {
		value = +valueRaw;
	} else if (AND_OR_COMMAND.test(valueRaw)) {
		const [,d1, cmd, d2] = valueRaw.match(AND_OR_COMMAND)!;
		op = cmd;
		deps.push(d1, d2);
	} else if (SHIFT_COMMAND.test(valueRaw)) {
		const [,d1, cmd, d2] = valueRaw.match(SHIFT_COMMAND)!;
		op = cmd;
		deps.push(d1);
		opVal = +d2;
	} else if (NOT_COMMAND.test(valueRaw)) {
		const [,d1] = valueRaw.match(NOT_COMMAND)!;
		op = 'NOT';
		deps.push(d1);
	} else {
		deps.push(valueRaw);
	}

	return {
		v,
		op,
		opVal,
		value,
		deps
	};
}

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

interface ParsedInput {
	v: string;
	op: string;
	opVal?: number;
	value?: number;
	deps: string[];
}

function run(_input: ParsedInput[], overrides?: Record<string, Partial<ParsedInput>>) {
	const input = _.cloneDeep(_input);

	const resolved = _(input)
		.keyBy('v')
		.assign(overrides)
		.value();

	do {
		for (let cmd in resolved) {
			if (resolved[cmd].value !== undefined) {
				continue;
			}

			if (resolved[cmd].deps.every(d => !isNaN(+d) || resolved[d].value !== undefined)) {
				const {op, deps, opVal} = resolved[cmd];

				if (op === 'AND') {
					const v1 = isNaN(+deps[0]) ? resolved[deps[0]].value : +deps[0];
					const v2 = isNaN(+deps[1]) ? resolved[deps[1]].value : +deps[1];
					resolved[cmd].value = v1! & v2!;

					continue;
				}

				if (op === 'OR') {
					const v1 = isNaN(+deps[0]) ? resolved[deps[0]].value : +deps[0];
					const v2 = isNaN(+deps[1]) ? resolved[deps[1]].value : +deps[1];
					resolved[cmd].value = v1! | v2!;

					continue;
				}

				if (op === 'LSHIFT') {
					resolved[cmd].value = resolved[deps[0]].value! << opVal!;
					continue;
				}

				if (op === 'RSHIFT') {
					resolved[cmd].value = resolved[deps[0]].value! >> opVal!;
					continue;
				}

				if (op === 'NOT') {
					resolved[cmd].value = (Math.pow(2, 16) + ~resolved[deps[0]].value!) % Math.pow(2, 16);
					continue;
				}

				if (op === 'VALUE') {
					resolved[cmd].value = resolved[deps[0]].value;
				}
			}
		}
	} while (input.some(r => r.value === undefined));

	return resolved['a']?.value || resolved['h']?.value;
}

function solve1(input: ParsedInput[]) {
	return run(input);
}

function solve2(input: ParsedInput[]) {
	const substitueVal = run(input);

	return run(input, {b: {
		op: 'VALUE',
		value: substitueVal,
		deps: []
	}});
}

function exec(inputFilename: string, solver: Function, inputStr?: string) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
	const {join} = require('path')

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};