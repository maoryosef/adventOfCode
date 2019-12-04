'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const passwordRange = _(input)
	.split('-')
	.map(part => parseInt(part))
	.value();

function validatePassword(password) {
	const passArray = (password + '').split('').map(num => parseInt(num));

	if (passArray.length !== 6) {
		return false;
	}

	let prevNum = passArray[0];
	let foundDouble = false;

	for (let i = 1; i < passArray.length; i++) {
		if (passArray[i] === prevNum) {
			foundDouble = true;
		}

		if (passArray[i] < prevNum) {
			return false;
		}
		prevNum = passArray[i];
	}

	return foundDouble;
}

let validCount = 0;

for (let num = passwordRange[0]; num <= passwordRange[1]; num++) {
	if (validatePassword(num)) {
		validCount++;
	}
}

console.log(validCount);