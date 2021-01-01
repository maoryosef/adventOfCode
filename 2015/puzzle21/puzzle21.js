'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split(': ')
		.map((x, i) => i === 0 ? x : +x);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.fromPairs()
		.value();

	return parsedInput;
}

function simulate(players) {
	let attacker = 0;
	let defender = 1;

	while (players[attacker]['Hit Points'] > 0 && players[defender]['Hit Points'] > 0) {
		const attackerDamage = Math.max(players[attacker].Damage - players[defender].Armor, 1);

		players[defender]['Hit Points'] -= attackerDamage;

		attacker = (attacker + 1) % 2;
		defender = (defender + 1) % 2;
	}

	return players[0]['Hit Points'] > 0;
}

const WEAPONS = {
	Dagger: {cost: 8, damage: 4, armor: 0},
	Shortsword: {cost: 10, damage: 5, armor: 0},
	Warhammer: {cost: 25, damage: 6, armor: 0},
	Longsword: {cost: 40, damage: 7, armor: 0},
	Greataxe: {cost: 74, damage: 8, armor: 0}
};

const ARMOR = {
	None: {cost: 0, damage: 0, armor: 0},
	Leather: { cost: 13, damage: 0, armor: 1 },
	Chainmail: { cost: 31, damage: 0, armor: 2 },
	Splintmail: { cost: 53, damage: 0, armor: 3 },
	Bandedmail: { cost: 75, damage: 0, armor: 4 },
	Platemail: { cost: 102, damage: 0, armor: 5 }
};

const RINGS = {
	None: {cost: 0, damage: 0, armor: 0},
	Damage1: { cost: 25, damage: 1, armor: 0 },
	Damage2: { cost: 50, damage: 2, armor: 0 },
	Damage3: { cost: 100, damage: 3, armor: 0 },
	Defense1: { cost: 20, damage: 0, armor: 1 },
	Defense2: { cost: 40, damage: 0, armor: 2 },
	Defense3: { cost: 80, damage: 0, armor: 3 }
};

function runAllSimulations(boss) {
	const builds = [];
	for (const wProp of Object.values(WEAPONS)) {
		for (const aProp of Object.values(ARMOR)) {
			for (const [r, rProp] of Object.entries(RINGS)) {
				for (const [r2, r2Prop] of Object.entries(RINGS)) {
					if (r2 === r && r2 !== 'None') {
						continue;
					}

					const build = {
						cost: wProp.cost + aProp.cost + rProp.cost + r2Prop.cost,
						Damage: wProp.damage + aProp.damage + rProp.damage + r2Prop.damage,
						Armor: wProp.armor + aProp.armor + rProp.armor + r2Prop.armor
					};

					builds.push(build);
				}
			}
		}
	}

	return builds.map(b => {
		const win = simulate([{...b, 'Hit Points': 100}, {...boss}]);

		return {
			cost: b.cost,
			win
		};
	});
}

function solve1(boss) {
	return runAllSimulations(boss)
		.filter(x => x.win)
		.sort((a, b) => a.cost - b.cost)[0].cost;
}

function solve2(boss) {
	return runAllSimulations(boss)
		.filter(x => !x.win)
		.sort((a, b) => b.cost - a.cost)[0].cost;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};