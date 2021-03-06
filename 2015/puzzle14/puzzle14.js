'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [name, speed, time, restTime] = row
		.match(/(.*?) can fly (\d+?) km\/s for (\d+?) seconds, but then must rest for (\d+?) seconds./)
		.slice(1)
		.map((x, i) => i === 0 ? x.toLowerCase() : +x);

	return {
		name,
		speed,
		time,
		restTime
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function calcDistance(reindeer, raceTime) {
	const runDuration = Math.floor(raceTime / (reindeer.time + reindeer.restTime));
	runDuration;
	const initialRun = reindeer.speed * reindeer.time * runDuration;
	const remainder =  Math.min(raceTime % (reindeer.time + reindeer.restTime), reindeer.time);

	return initialRun + remainder * reindeer.speed;
}

function solve1(input) {
	const raceTime = input.length > 2 ? 2503 : 1000;

	const raceResults = input
		.map(reindeer => calcDistance(reindeer, raceTime))
		.sort((a, b) => b - a);

	return raceResults[0];
}

function solve2(input) {
	const raceTime = input.length > 2 ? 2503 : 1000;

	const reindeers = input.map(x => ({...x, points: 0, runTime: 0, sleepTime: 0, d: 0}));

	for (let i = 0; i < raceTime; i++) {
		for (const r of reindeers) {
			if (!r.runTime && !r.sleepTime) {
				r.runTime = r.time;
				r.sleepTime = r.restTime;
			} else if (!r.runTime && r.sleepTime) {
				r.sleepTime--;
				continue;
			}

			if (r.runTime) {
				r.runTime--;
				r.d += r.speed;
			}
		}

		const max = reindeers.reduce((prev, r) => Math.max(prev, r.d), 0);
		reindeers.forEach(r => {
			if (r.d === max) {
				r.points++;
			}
		});
	}

	return reindeers.reduce((prev, r) => Math.max(prev, r.points), 0);
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