'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.value();

	return parsedInput;
}

const OP = {
	'+': (a, b) => a + b,
	'*': (a, b) => a * b
};

function tokenize(str) {
	return str
		.replace(/\s+/g, '')
		.split('')
		.reduce((acc, v) => {
			if (!isNaN(+v)) {
				acc.push({t: 'L', v});
			} else if (OP[v]) {
				acc.push({t: 'O', v});
			} else {
				acc.push({t: v});
			}

			return acc;
		}, []);
}

const peek = stack => stack.slice(-1)[0];

function parseExpression(expr, precedence) {
	const outStack = [];
	const opStack = [];
	const tokens = tokenize(expr);

	tokens.forEach(({t, v}) => {
		if (t === 'L') {
			outStack.push({v: +v, rightNode: null, leftNode: null});
			return;
		}

		if (t === 'O') {
			while (OP[peek(opStack)] && precedence[v] <= precedence[peek(opStack)]) {
				outStack.push({
					v: opStack.pop(),
					rightNode: outStack.pop(),
					leftNode: outStack.pop()
				});
			}

			opStack.push(v);
			return;
		}

		if (t === '(') {
			opStack.push(t);
			return;
		}

		if (t === ')') {
			while (peek(opStack) !== '(') {
				outStack.push({
					v: opStack.pop(),
					rightNode: outStack.pop(),
					leftNode: outStack.pop()
				});
			}

			opStack.pop();
			return;
		}
	});

	while (opStack.length > 0) {
		outStack.push({
			v: opStack.pop(),
			rightNode: outStack.pop(),
			leftNode: outStack.pop()
		});
	}

	return outStack.pop();
}

function calcAst(ast) {
	if (!ast.rightNode && !ast.leftNode) {
		return ast.v;
	}

	return OP[ast.v](
		calcAst(ast.rightNode),
		calcAst(ast.leftNode)
	);
}

function calcExpression(expr, precedence = {'+': 1, '*': 1}) {
	return calcAst(parseExpression(expr, precedence));
}

function solve1(input) {
	return input
		.map(row => calcExpression(row))
		.reduce((acc, v) => acc + v, 0);
}

function solve2(input) {
	return input
		.map(row => calcExpression(row, {'+': 2, '*': 1}))
		.reduce((acc, v) => acc + v, 0);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.2.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2,
		'((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};