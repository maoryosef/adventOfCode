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
		.mapKeys((v, k) => k === 'Hit Points' ? 'hp' : k.toLowerCase())
		.value();

	return parsedInput;
}

const SPELLS = {
	missile: { cost: 53, damage: 4, armor: 0, duration: 1, heal: 0, mana: 0},
	drain: { cost: 73, damage: 2, armor: 0, duration: 1, heal: 2, mana: 0},
	shield: { cost: 113, damage: 0, armor: 7, duration: 6, heal: 0, mana: 0},
	poison: { cost: 173, damage: 3, armor: 0, duration: 6, heal: 0, mana: 0},
	recharge: { cost: 229, damage: 0, armor: 0, duration: 5, heal: 0, mana: 101},
};

function getStateKey({playerHp, mana, spent}, {hp: bossHp}, turn, activeSpells) {
	const spellsStr = Object.entries(activeSpells).map(([k, v]) => `${k}:${v}`).join(';');
	const attacker = turn % 2 === 1 ? 'p' : 'b';
	return `${playerHp};${mana};${spent};${bossHp};${spellsStr};${attacker}`;
}

function getAllOutcomes(player, boss, drainHp = 0, turn = 1, activeSpells = {}, visited = new Map()) {
	const stateKey = getStateKey(player, boss, turn, activeSpells);

	if (visited.get(stateKey)) {
		return null;
	}

	visited.set(stateKey, true);

	if (drainHp && turn % 2 === 1) {
		player.hp -= drainHp;

		if (player.hp <= 0) {
			return null;
		}
	}

	player.armor = 0;
	for (const [spellName, d] of Object.entries(activeSpells)) {
		if (d > 0) {
			const spell = SPELLS[spellName];
			activeSpells[spellName]--;
			boss.hp -= spell.damage;
			player.armor += spell.armor;
			player.mana += spell.mana;
			player.hp += spell.heal;
		}
	}

	if (boss.hp <= 0) {
		return player.spent;
	}

	if (turn % 2 === 0) {
		const attackDamage = Math.max(boss.damage - player.armor, 1);
		player.hp -= attackDamage;
	}

	if (player.hp <= 0) {
		return null;
	}

	if (turn % 2 === 0) {
		return getAllOutcomes({...player}, {...boss}, drainHp, turn + 1, {...activeSpells}, visited);
	}

	const availableSpells = Object.keys(SPELLS)
		.filter(x => !activeSpells[x])
		.filter(x => SPELLS[x].cost <= player.mana);

	let minOutcome = null;

	for (const spellName of availableSpells) {
		const spell = SPELLS[spellName];
		const outcome = getAllOutcomes(
			{...player, spent: player.spent + spell.cost, mana: player.mana - spell.cost},
			{...boss},
			drainHp,
			turn + 1,
			{...activeSpells, [spellName]: spell.duration},
			visited
		);

		if (outcome) {
			minOutcome = Math.min(minOutcome || Infinity, outcome);
		}
	}

	return minOutcome;
}

function solve1(boss) {
	const player = {
		hp: 50,
		mana: 500,
		armor: 0,
		spent: 0
	};

	return getAllOutcomes({...player}, {...boss});
}

function solve2(boss) {
	const player = {
		hp: 50,
		mana: 500,
		armor: 0,
		spent: 0
	};

	return getAllOutcomes({...player}, {...boss}, 1);
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
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};