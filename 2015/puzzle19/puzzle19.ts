import fs from 'fs';
import _ from 'lodash';

function parseRow(row: string) {
	if (row.includes('=>')) {
		return row.split('\n')
			.map(x => x.split(' => '))
			.reduce((obj: Record<string, string[]>, [k, v]) => ({...obj, [k]: [...obj[k] || [], v]}), {});
	}

	return row;
}

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function getOptions(molecule: string, replacements: Record<string, string[]>) {
	const generated = new Set();

	for (const [k, v] of Object.entries(replacements)) {
		const regEx = new RegExp(k, 'g');
		while (regEx.exec(molecule)){
			for (const r of v) {
				const newStr = molecule.slice(0, regEx.lastIndex - k.length) + r + molecule.slice(regEx.lastIndex);
				generated.add(newStr);
			}
		}
	}

	return generated;
}

function solve1([replacements, molecule]: [Record<string, string[]>, string]) {
	return getOptions(molecule, replacements).size;
}

function shuffleArray(array: string[][]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];

		array[i] = array[j];
		array[j] = temp;
	}
}

function solve2([replacements, molecule]: [Record<string, string[]>, string]) {
	const replacementsArr = [];

	for (const [k, v] of Object.entries(replacements)) {
		for (const r of v) {
			replacementsArr.push([k, r]);
		}
	}

	let target = molecule;
	let mutations = 0;

	while (target !== 'e') {
		const tmp = target;
		for (const rep of replacementsArr) {
			const to = rep[0];
			const from = rep[1];
			const index = target.indexOf(from);
			if (index > -1) {
				target = target.slice(0, index) + to + target.slice(index + from.length);
				mutations++;
			}
		}

		if (tmp === target) {
			target = molecule;
			mutations = 0;
			shuffleArray(replacementsArr);
		}
	}

	return mutations;
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
		solve1
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};