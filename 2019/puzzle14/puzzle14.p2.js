'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const parseDependencies = depString => _(depString)
	.split(', ')
	.map(dep => ({q: parseInt(dep.split(' ')[0]), e: dep.split(' ')[1]}))
	.value();

const depG = _(input)
	.split('\n')
	.map(row => row.split(' => '))
	.keyBy(row => row[1].split(' ')[1])
	.mapValues(row => ({e: row[1].split(' ')[1], q: parseInt(row[1].split(' ')[0]), d: parseDependencies(row[0].split('\', \'')[0])}))
	.value();

const baseElements = _.pickBy(depG, el => el.d.length === 1 && el.d[0].e === 'ORE');

function calcOre(reqs) {
	let ore = 0;

	_.forEach(reqs, (r, e) => {
		const oreRequired = depG[e].d[0];

		ore += Math.ceil(r / depG[e].q) * oreRequired.q;
	});

	return ore;
}

function getReqs(element, fuelAmount = 1) {
	const deps = depG[element].d;

	const reqs =_(deps)
		.keyBy('e')
		.mapValues('q')
		.mapValues(v => v * fuelAmount)
		.value();

	let reqsList = _.keys(reqs);
	const excess = {};

	while (reqsList.length) {
		const req = reqsList.shift();
		if (baseElements[req]) {
			continue;
		}

		const quantity = reqs[req];

		delete reqs[req];

		const element = depG[req];
		const factor = Math.ceil(quantity / element.q);

		element.d.forEach(d => {
			reqs[d.e] = (reqs[d.e] || 0) + factor * d.q;
		});

		excess[req] = (excess[req] || 0) + factor * element.q  - quantity;

		if (depG[req].q <= excess[req]) {
			const removeAmount = Math.ceil(depG[req].q / excess[req]) * depG[req].q;
			reqs[req] = -removeAmount;
			excess[req] -= removeAmount;
		}

		reqsList = _.keys(reqs);
	}

	return reqs;
}


function calcRequiredOres(fuelAmount) {
	const reqs = getReqs('FUEL', fuelAmount);
	const ores = calcOre(reqs);

	return ores;
}

const ORES = 1000000000000;
const perOneFuel = calcRequiredOres(1);

let minimum = Math.floor(ORES / perOneFuel);
let maximum = Math.floor(2 * ORES / perOneFuel);
let mid = Math.floor((maximum + minimum) / 2);

while (minimum < maximum) {
	const requiredOres = calcRequiredOres(mid);

	if (requiredOres > ORES) {
		maximum = mid - 1;
	} else {
		minimum = mid + 1;
	}

	mid = Math.floor((maximum + minimum) / 2);
}

const res = (calcRequiredOres(mid) > ORES) ? mid - 1 : mid;

console.log(res);