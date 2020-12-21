'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [ingridientsRaw, allergansRaw] = row.split(' (contains ');


	return {
		ingridients: ingridientsRaw.split(' '),
		allergans: allergansRaw.slice(0, -1).split(', ')
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function getFoodsWithNoAllergans(input) {
	const allIngridients = new Set(input.reduce((acc, food) => [...acc, ...food.ingridients], []));
	const possibleAllergans = new Map();
	const foodsByAllergans = input.reduce((acc, food) => {
		food.allergans.forEach(allergan => {
			acc[allergan] = acc[allergan] || [];
			acc[allergan].push(food.ingridients);
		});

		return acc;
	}, {});

	input.forEach(food => {
		food.ingridients.forEach(ingridient => {
			const entry = possibleAllergans.get(ingridient) || new Set();

			food.allergans.forEach(allergan => {
				entry.add(allergan);
			});

			possibleAllergans.set(ingridient, entry);
		});
	});

	const noAllergans = [...allIngridients].filter(ingridient => {
		const allergansOptions = possibleAllergans.get(ingridient);

		return [...allergansOptions].every(allergan => foodsByAllergans[allergan].some(ingList => !ingList.includes(ingridient)));
	});

	noAllergans.forEach(allergan => {
		possibleAllergans.delete(allergan);
	});

	return {
		noAllergans,
		foodsByAllergans,
		possibleAllergans
	};
}

function solve1(input) {
	const {noAllergans} = getFoodsWithNoAllergans(input);
	let count = 0;

	input.forEach(food => {
		food.ingridients.forEach(ingridients => {
			if (noAllergans.includes(ingridients)) {
				count++;
			}
		});
	});

	return count;
}

function solve2(input) {
	const {possibleAllergans, foodsByAllergans} = getFoodsWithNoAllergans(input);
	const foundAllergans = new Map();

	let prevSize = -1;

	while (prevSize !== foundAllergans.size) {
		prevSize = foundAllergans.size;

		for (const [ingridient, allergansList] of possibleAllergans.entries()) {
			if (allergansList.size === 1) {
				continue;
			}

			for (const allergan of allergansList.values()) {
				if (foundAllergans.has(allergan) || foodsByAllergans[allergan].some(ingList => !ingList.includes(ingridient))) {
					allergansList.delete(allergan);
				}
			}

			if (allergansList.size === 1) {
				const allergan = allergansList.values().next().value;
				foundAllergans.set(allergan, ingridient);
			}
		}
	}

	return [...foundAllergans.keys()]
		.sort()
		.map(allergan => foundAllergans.get(allergan))
		.join(',');
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};