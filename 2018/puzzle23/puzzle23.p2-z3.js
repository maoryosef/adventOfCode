'use strict';
const fs = require('fs');
const _ = require('lodash');
const { execSync } = require('child_process');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const sensors = _(input)
	.split('\n')
	.map(l => {
		const [pos, rstr] = l.split(', ');
		const [x,y,z] = pos.slice(5, -1).split(',').map(v => parseInt(v));
		const r = parseInt(rstr.split('=')[1]);

		return {x, y, z, r};
	})
	.sortBy('r')
	.reverse()
	.value();



const smt = `
	(declare-const x Int)
	(declare-const y Int)
	(declare-const z Int)
	(declare-const distance Int)
	(define-fun in_range ((nx Int) (ny Int) (nz Int) (nr Int)) Int
	  (if (<= (+ (abs (- x nx)) (abs (- y ny)) (abs (- z nz))) nr) 1 0)
	)
	(assert (= distance (+ (abs x) (abs y) (abs z))))
	(maximize (+
	  ${sensors.map(b => `(in_range ${b.x} ${b.y} ${b.z} ${b.r})`).join('\n  ')}
	))
	(minimize distance)
	(check-sat)
	(get-model)`;

const output = execSync('z3 -in', { input: smt }).toString();
console.log(parseInt(output.match(/\d+/g).pop(), 10));