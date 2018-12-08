'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const parsedInput = _(input)
	.split(' ')
	.map(n => parseInt(n))
	.value();

console.log(parsedInput);

function readTree(count, treeArr) {
	let res = [];
	while (count) {
		const node = {metaData: []};

		let childrenCount = treeArr.shift();
		let metaDataCount = treeArr.shift();
		count--;
		let children = readTree(childrenCount, treeArr);
		node.children = children;

		while (metaDataCount) {
			const data = treeArr.shift();
			node.metaData.push(data);
			metaDataCount--;
		}

		res.push(node);
	}

	return res;
}

const [treeRoot] = readTree(1, parsedInput);

const nextItems = [treeRoot];
let count = 0;
while (nextItems.length) {
	const node = nextItems.shift();
	nextItems.push(...node.children);

	count = node.metaData.reduce((acc, v) => acc + v, count);
}

console.log(count);