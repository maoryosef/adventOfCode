'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const REG_EXP = /^(\d+) units each with (\d+) hit points (?:\((.*?)\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)$/i;
function parseInput(str) {
	let currentGroup = 'A';

	return _(str)
		.split('\n')
		.compact()
		.reduce((acc, line) => {
			if (line === 'Immune System:') {
				currentGroup = 'A';
			} else if (line === 'Infection:') {
				currentGroup = 'B';
			} else {
				const [count, health, traitsStr = '', attack, attackType, initiative] = line.match(REG_EXP).slice(1).map(v => {
					const asNumber = parseInt(v);
					return _.isNaN(asNumber) ? v : asNumber;
				});

				let weak = [];
				let immune = [];

				traitsStr.split(';').forEach(t => {
					const [trait, type] = t.split('to').map(s => s.trim());

					if (trait === 'weak') {
						weak = type.split(',').map(s => s.trim().toUpperCase());
					} else if (trait === 'immune') {
						immune = type.split(',').map(s => s.trim().toUpperCase());
					}
				});

				acc.push({count, health, weak, immune, attack, attackType: attackType.toUpperCase(), initiative, group: currentGroup});
			}

			return acc;
		}, []);
}

const units = parseInput(input);

function calculateEffectivePower() {
	units.forEach(u => {
		u.effectivePower = u.count * u.attack;
	});
}

function combatIsOver() {
	const [immunes, infections] = _(units)
		.filter(u => u.count > 0)
		.partition(u => u.group === 'A')
		.value();

	return immunes.length === 0 || infections.length === 0;
}

function boost(amount) {
	units.forEach(u => {
		if (u.group === 'A') {
			u.attack += amount;
		}
	});
}

/**
 * Bisecting
 * high 29
 * low 28
 */
boost(29);

while (!combatIsOver()) {
	calculateEffectivePower();
	const selectedTargets = new Set();
	const unitsByAttackOrder = _(units).filter(u => u.count > 0).sortBy(['effectivePower', 'initiative']).reverse().value();

	const unitsWithTargets = _(unitsByAttackOrder).map(attacker => {
		const possibleTargets = _(units)
			.filter(target => target.count > 0 && target.group !== attacker.group && !selectedTargets.has(target))
			.map(target => {
				const doubleDamage = target.weak.indexOf(attacker.attackType) > -1;
				const noDamage = target.immune.indexOf(attacker.attackType) > -1;

				return {unit: target, damage: noDamage ? 0 : (doubleDamage ? attacker.attack * 2 : attacker.attack)};
			})
			.filter(target => target.damage > 0)
			.sortBy(['damage', 'unit.effectivePower', 'unit.initiative'])
			.value();

		const targetUnit = _(possibleTargets)
			.takeRight()
			.head();

		if (targetUnit) {
			selectedTargets.add(targetUnit.unit);
		}

		return {attacker, target: targetUnit};
	})
		.sortBy(['attacker.initiative'])
		.reverse()
		.value();

	unitsWithTargets.forEach(({attacker, target}) => {
		if (target && attacker.count > 0 && target.unit.count > 0) {
			const damage = target.damage * attacker.count;
			const deaths = Math.trunc(damage / target.unit.health);
			target.unit.count -= deaths;
		}
	});
}

const winningGroup = units.filter(u => u.count > 0)[0].group;
console.log(winningGroup, 'is the winner');
console.log(units.filter(u => u.count > 0).reduce((acc, u) => acc + u.count, 0));

if (winningGroup !== 'A') {
	console.error('HE IS DEAD');
	process.exit(1);
}