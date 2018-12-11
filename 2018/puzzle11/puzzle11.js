'use strict';
const _ = require('lodash');
const [sizeArg] = process.argv.splice(2);

const SERIAL_NUMBER = 5177;
const SQUARE_SIZE = parseInt(sizeArg);

function calcPower(x, y) {
	const rackId = x + 10;

	let powerLevel = (rackId * y + SERIAL_NUMBER) * rackId;

	return Math.trunc((powerLevel / 100) % 10) - 5;
}

const calcCache = {};
let largestSquare = -Infinity;
let squarePos = null;

for (let x = 1; x <= 300 - SQUARE_SIZE; x++) {
	for (let y = 1; y <= 300 - SQUARE_SIZE; y++) {
		let sVal = 0;
		for (let sx = x; sx < x + SQUARE_SIZE; sx++) {
			for (let sy = y; sy < y + SQUARE_SIZE; sy++) {
				let power = _.get(calcCache, [sx, sy]);

				if (power === undefined) {
					power = calcPower(sx, sy);
					_.set(calcCache, [sx, sy], power);
				}

				sVal += power;
			}
		}

		if (sVal > largestSquare) {
			largestSquare = sVal;
			squarePos = [x, y, SQUARE_SIZE];
		}
	}
}

console.log(...squarePos, largestSquare);