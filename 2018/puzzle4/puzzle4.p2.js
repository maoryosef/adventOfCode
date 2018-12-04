'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const DATE_REG_EX = /\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})\] .*$/i;
const ACTION_REG_EX = /\[.*?\] (.*)$/i;
const GUARD_REG_EX = /Guard #(\d*?) begins shift$/i;

function parseLine(str) {
	const [year, month, day, hour, minute] = str.match(DATE_REG_EX).slice(1).map(v => parseInt(v));
	const [action] = str.match(ACTION_REG_EX).slice(1).map(action => {
		if (action === 'wakes up') {
			return 'W';
		}

		if (action === 'falls asleep') {
			return 'S';
		}

		return action.match(GUARD_REG_EX).slice(1).map(v => parseInt(v))[0];

	});

	return {year, month, day, hour, minute, action};
}

let currentGuard = null;
let wakeMap = {};
let sleepStart = null;

_(input)
	.split('\n')
	.map(parseLine)
	.sortBy(['year', 'month', 'day', 'hour', 'minute'])
	.forEach(log => {
		if (log.action === 'S') {
			sleepStart = log.minute;
		} else if (log.action === 'W') {
			for (let i = sleepStart; i < log.minute; i++) {
				const sleepCount = _.get(wakeMap, [`${currentGuard}`, `_${i}`], 0);
				_.set(wakeMap, [`${currentGuard}`, `_${i}`], sleepCount + 1);
			}
		} else {
			currentGuard = log.action;
		}
	});

const sortPairs = pair => pair[1];

const [[guard]] = _(wakeMap)
	.mapValues(v => _(v).toPairs().sortBy(sortPairs).takeRight().value()[0][1])
	.toPairs()
	.sortBy(sortPairs)
	.takeRight()
	.value();

console.log(guard);

const minute = _(wakeMap[guard])
	.toPairs()
	.sortBy(sortPairs)
	.takeRight()
	.value();

console.log(minute);

console.log(parseInt(minute[0][0].slice(1)) * guard);