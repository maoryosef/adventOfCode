const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const rules = input.split('\n').reduce((acc, ruleStr) => {
	const ruleLine = ruleStr.split('=>');

	const ruleGrid = ruleLine[0].split('/').map(line => line.trim().split(''));
	const ruleRes = ruleLine[1].split('/').map(line => line.trim().split(''));
	acc[ruleGrid.length] = acc[ruleGrid.length] || [];

	acc[ruleGrid.length].push({
		ruleGrid,
		ruleRes
	});

	return acc;
}, {});

function flipHoriz(grid) {
	let retVal = [];

	for (let i = 0; i < grid.length; i++) {
		let x = 0;
		retVal[i] = [];
		for (let j = grid.length - 1; j >= 0; j--) {
			retVal[i][x] = grid[i][j];
			x++;
		}
	}

	return retVal;
}

function flipVert(grid) {
	let retVal = [];

	let y = 0;
	for (let i = grid.length - 1; i >= 0; i--) {
		retVal[y] = [];
		for (let j = 0; j < grid.length; j++) {
			retVal[y][j] = grid[i][j];
		}
		y++;
	}

	return retVal;
}

function rotate(grid) {
	let retVal = [];

	for (let i = 0; i < grid.length; i++) {
		retVal[i] = [];
		for (let j = 0; j < grid.length; j++) {
			retVal[i][j] = grid[j][i];
		}
	}

	return flipHoriz(retVal);
}

const gridRuleCache = {};

function isMatchesRule(grid, rule) {
	let gridClone = grid;

	for (let i = 0; i < 4; i++) {
		if (_.isEqual(gridClone, rule)) {
			return true;
		}

		gridClone = flipHoriz(gridClone);

		if (_.isEqual(gridClone, rule)) {
			return true;
		}

		gridClone = flipHoriz(gridClone);
		gridClone = flipVert(gridClone);

		if (_.isEqual(gridClone, rule)) {
			return true;
		}

		gridClone = flipVert(gridClone);
		gridClone = rotate(gridClone);
	}

	return false;
}

function replaceWindow(gridWindow, ruleSet, newInput, i, j) {
	let found = false;

	const gridHash = gridWindow.map(row => row.join('')).join('/');

	if (gridRuleCache[gridHash]) {
		newInput = replaceGrid(i, j, newInput, gridRuleCache[gridHash]);
	} else {
		ruleSet.forEach(rule => {
			if (found) {
				return;
			}

			if (isMatchesRule(gridWindow, rule.ruleGrid)) {
				newInput = replaceGrid(i, j, newInput, rule.ruleRes);
				gridRuleCache[gridHash] = rule.ruleRes;
				found = true;
			}
		});
	}

	return newInput;
}

function replaceGrid(y, x, grid, resGrid) {
	let retVal = grid;

	if (resGrid.length === 4) {
		y = y / 3 * 4;
		x = x / 3 * 4;
	} else {
		y = y / 2 * 3;
		x = x / 2 * 3;
	}

	for (let i = 0; i < resGrid.length; i++) {
		if (!retVal[y + i]) {
			retVal.push([]);
		}
		for (let j = 0; j < resGrid.length; j++) {
			if (!retVal[y + i][x + j]) {
				retVal[y + i].push('');
			}

			retVal[y + i][x + j] = resGrid[i][j];
		}
	}

	return retVal;
}

let inputGrid = [
	['.', '#', '.'],
	['.', '.', '#'],
	['#', '#', '#']
];

const ITERATIONS = 18;

for (let i = 0; i < ITERATIONS; i++) {
	console.log(i, inputGrid.length);
	let newInput = JSON.parse(JSON.stringify(inputGrid));

	if (inputGrid.length % 2 === 0) {
		const ruleSet = rules['2'];

		let gridWindow = [
			['', ''],
			['', '']
		];

		for (let i = 0; i < inputGrid.length - 1; i += 2) {
			for (let j = 0; j < inputGrid.length - 1; j += 2) {
				gridWindow[0][0] = inputGrid[i][j];
				gridWindow[0][1] = inputGrid[i][j + 1];
				gridWindow[1][0] = inputGrid[i + 1][j];
				gridWindow[1][1] = inputGrid[i + 1][j + 1];

				newInput = replaceWindow(gridWindow, ruleSet, newInput, i, j);
			}
		}
	} else {
		const ruleSet = rules['3'];

		let gridWindow = [
			['', '', ''],
			['', '', ''],
			['', '', '']
		];

		for (let i = 0; i < inputGrid.length - 2; i += 3) {
			for (let j = 0; j < inputGrid.length - 2; j += 3) {
				gridWindow[0][0] = inputGrid[i][j];
				gridWindow[0][1] = inputGrid[i][j + 1];
				gridWindow[0][2] = inputGrid[i][j + 2];
				gridWindow[1][0] = inputGrid[i + 1][j];
				gridWindow[1][1] = inputGrid[i + 1][j + 1];
				gridWindow[1][2] = inputGrid[i + 1][j + 2];
				gridWindow[2][0] = inputGrid[i + 2][j];
				gridWindow[2][1] = inputGrid[i + 2][j + 1];
				gridWindow[2][2] = inputGrid[i + 2][j + 2];

				newInput = replaceWindow(gridWindow, ruleSet, newInput, i, j);
			}
		}
	}

	inputGrid = newInput.slice();
}

function countPixels(grid) {
	let pixelsCount = 0;
	grid.forEach(row => {
		row.forEach(col => {
			if (col === '#') {
				pixelsCount++;
			}
		});
	});

	return pixelsCount;
}

console.log(countPixels(inputGrid));