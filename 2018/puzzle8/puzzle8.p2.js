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

function readData(root) {
	if (!root) {
		return 0;
	}

	const {metaData, children} = root;

	if (!children.length) {
		return metaData.reduce((acc, val) => acc + val, 0);
	}

	return metaData.reduce((acc, val) => {
		if (val === 0) {
			return acc;
		}

		return acc + readData(children[val - 1]);
	}, 0);
}

console.log(readData(treeRoot));