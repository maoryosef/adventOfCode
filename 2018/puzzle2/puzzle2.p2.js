'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

function getDiff(str1, str2) {
	const diff = ['', ''];
	for (let i = 0; i < str1.length; i++) {
		if (str1[i] === str2[i]) {
			diff[1] += str1[i];
		} else {
			diff[0] += str1[i];
		}
	}

	return diff;
}

const res = _(input)
	.split('\n')
	.value();

for (let str1 of res) {
	for (let str2 of res) {
		const diff = getDiff(str1, str2);

		if (diff[0].length === 1) {
			console.log(diff);
		}
	}
}