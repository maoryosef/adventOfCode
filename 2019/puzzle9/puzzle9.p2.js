'use strict';

const TEST_MODE=false;

const fs = require('fs');
const {runProgram, parseProgram} = require('../intCodeRunner');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const program = parseProgram(input);
const res = runProgram([2], program);

console.log('output:', res);
