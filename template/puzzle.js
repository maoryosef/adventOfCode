'use strict';

const TEST_MODE=true;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const res = _(input)
	.split('\n')
	.map(num => parseInt(num))
	.reduce((acc, val) => acc + val, 0);

console.log(res);