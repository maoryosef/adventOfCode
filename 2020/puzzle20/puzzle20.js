'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseTile(row) {
	const [header, ...rest] = row.split('\n');

	return {
		id: header.slice(5, -1),
		tile: rest
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseTile)
		.value();

	return parsedInput;
}

function getTileEdges(tile) {
	const top = tile[0];
	const bottom = tile[tile.length - 1];
	const left = tile.reduce((acc, r) => acc + r.charAt(0), '');
	const right = tile.reduce((acc, r) => acc + r.charAt(r.length - 1), '');

	return {
		top,
		bottom,
		left,
		right
	};
}
function calcEdgesMap(input) {
	return input.reduce((acc, {id, tile}) => {
		acc[id] = getTileEdges(tile);

		return acc;
	}, {});
}

function getEdgesByTile(edgesMap) {
	return Object.keys(edgesMap).reduce((acc, key) => {
		const {top, bottom, left, right} = edgesMap[key];

		acc[top] = acc[top] || [];
		acc[bottom] = acc[bottom] || [];
		acc[left] = acc[left] || [];
		acc[right] = acc[right] || [];
		acc[top].push(key);
		acc[bottom].push(key);
		acc[left].push(key);
		acc[right].push(key);

		return acc;
	}, {});
}

function getAdjacentsMap(edgesMap, edgeByTile) {
	return Object.entries(edgesMap).reduce((acc, [key, edges]) => {
		const adjacent = {};
		['top', 'bottom', 'left', 'right'].forEach(sideKey => {
			const side = edges[sideKey];
			const sideReversed = side.split('').reverse().join('');

			if (edgeByTile[side].length > 1 || (edgeByTile[sideReversed] && edgeByTile[sideReversed].length)) {
				const sideAdjacent = edgeByTile[side].filter(x => x !== key);
				const sideReveresedAdjacent = edgeByTile[sideReversed]?.filter(x => x !== key) || [];
				adjacent[sideKey] = sideAdjacent[0] || sideReveresedAdjacent[0];
			}
		});

		acc[key] = adjacent;

		return acc;
	}, {});
}

function solve1(input) {
	const edgesMap = calcEdgesMap(input);
	const edgeByTile = getEdgesByTile(edgesMap);

	const adjacentMap = getAdjacentsMap(edgesMap, edgeByTile);
	const corners = Object.keys(adjacentMap).filter(k => Object.keys(adjacentMap[k]).length === 2);

	return corners.reduce((acc, v) => acc *= +v, 1);
}

const rotate = t => t.map((x, i) => t.map(r => r[i]).reverse()).map(x => x.join(''));
const flip = t => t.map(r => r.split('').reverse().join(''));

function allTileRotations(tile) {
	return [
		tile,
		rotate(tile),
		rotate(rotate(tile)),
		rotate(rotate(rotate(tile))),
	];
}

function allPositions(tile) {
	const rotations = allTileRotations(tile);

	return rotations.concat(rotations.map(t => flip(t)));
}

function findRight(source, candidates, tilesMap) {
	const rightEdge = source.reduce((acc, r) => acc + r.charAt(r.length - 1), '');

	for (const c of candidates) {
		const target = tilesMap[c];
		const found = allPositions(target).find(rot => {
			const leftEdge = rot.reduce((acc, r) => acc + r.charAt(0), '');

			return rightEdge === leftEdge;
		});

		if (found) {
			return {
				c,
				found
			};
		}
	}

	return null;
}

function findBottom(source, candidates, tilesMap) {
	const bottomEdge = source[source.length - 1];

	for (const c of candidates) {
		const target = tilesMap[c];
		const found = allPositions(target).find(rot => {
			const topEdge = rot[0];

			return bottomEdge === topEdge;
		});

		if (found) {
			return {
				c,
				found
			};
		}
	}

	return null;
}

const SEA_MONSTER = [
	'..................#.',
	'#....##....##....###',
	'.#..#..#..#..#..#...'
];

const MONSTER_LENGTH = SEA_MONSTER[1].length;
const MONSTER_REGEX = SEA_MONSTER.map(row => new RegExp(row));
const MONSTER_HASH_COUNT = SEA_MONSTER.join('').match(/#/g).length;

function countSeaMonsters(image) {
	let matches = 0;

	for (let i = 1; i < image.length - 1; i++) {
		let idx = 0;
		let match;

		while ((match = image[i].slice(idx).match(MONSTER_REGEX[1]))) {
			if (
				MONSTER_REGEX[0].test(image[i-1].slice(idx + match.index)) &&
				MONSTER_REGEX[2].test(image[i+1].slice(idx + match.index))
			) {
				matches++;
			}

			idx += match.index + MONSTER_LENGTH;
		}
	}

	return matches;
}

function solve2(input) {
	const tilesMap = input.reduce((acc, {id, tile}) => ({...acc, [id]: tile}), {});
	const edgesMap = calcEdgesMap(input);
	const edgeByTile = getEdgesByTile(edgesMap);
	const adjacentMap = getAdjacentsMap(edgesMap, edgeByTile);

	let next = Object.keys(adjacentMap).find(k => !adjacentMap[k].top && !adjacentMap[k].left);
	const positioned = new Set();
	const tilesArr = [[next]];
	let y = 0;

	while(next) {
		positioned.add(next);
		const possibleTiles = Object.values(adjacentMap[next]).filter(t => !positioned.has(t));
		const fixedTile = findRight(tilesMap[next], possibleTiles, tilesMap);
		if (fixedTile) {
			next = fixedTile.c;
			tilesArr[y].push(next);
			tilesMap[next] = fixedTile.found;
		} else if (positioned.size < input.length) {
			next = tilesArr[y][0];
			y++;
			const possibleBottomTiles = Object.values(adjacentMap[next]).filter(t => !positioned.has(t));
			const fixedBottomTile = findBottom(tilesMap[next], possibleBottomTiles, tilesMap);

			if (!fixedBottomTile) {
				break;
			}

			next = fixedBottomTile.c;
			tilesArr[y] = [next];
			tilesMap[next] = fixedBottomTile.found;
		} else {
			break;
		}
	}

	let fullImage = '';

	tilesArr.forEach(row => {
		for (let y = 1; y < tilesMap[row[0]].length -1; y++) {
			fullImage += row.reduce((acc, v) => acc + tilesMap[v][y].slice(1, -1), '') + '\n';
		}
	});

	const hashNumInImage = fullImage.match(/#/g).length;
	const monstersCount = allPositions(fullImage.split('\n')).map(countSeaMonsters).find(count => !!count);

	return hashNumInImage - monstersCount * MONSTER_HASH_COUNT;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};