'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const WIDTH=25;
const HEIGHT=6;

const fewestZeros = _(input)
	.split('')
	.map(num => parseInt(num))
	.thru(arr => _.chunk(arr, WIDTH * HEIGHT))
	.map(arr => ({arr, l: _.filter(arr, n => n === 0).length}))
	.sortBy('l')
	.head();

const res = _(fewestZeros.arr)
	.filter(n => n === 1 || n === 2)
	.partition(n => n === 1)
	.map('length')
	.value();

console.log(res, res[0] * res[1]);