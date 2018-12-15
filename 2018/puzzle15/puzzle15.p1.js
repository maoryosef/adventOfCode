'use strict';
const fs = require('fs');
const _ = require('lodash');

//1 is working should be 47 * 590 = 27730.
//2 is working should be 37 * 982 = 36334
//3 is working should be 46 * 859 = 39514
//4 is working should be 35 * 793 = 27755
//5 is working should be 54 * 536 = 28944
//6 is working should be 20 * 937 = 18740
const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const map = _(input.split('\n'))
	.map(v => v.split(''))
	.unzip()
	.value();

let players = [];
let playerId = 0;
for (let x = 0; x < map.length; x++) {
	for (let y = 0; y < map[x].length; y++) {
		if (map[x][y] === 'G' || map[x][y] === 'E') {
			const p = {
				id: playerId++,
				t: map[x][y],
				x,
				y,
				hp: 200
			};

			players.push(p);
			map[x][y] = p;
		}
	}
}

function getNeighboors(x, y, visited) {
	return [
		{x, y: y - 1},
		{x: x - 1, y},
		{x: x + 1, y},
		{x, y: y+1},
	]. filter(({x, y}) => !_.get(visited, [x, y]));
}

function backTrack(x, y, backPath, p) {
	const k = `${x}-${y}`;
	const parent = backPath[k];
	if (x === p.x && y === p.y) {
		return [{x: p.x, y: p.y}];
	}

	return [...backTrack(parent.x, parent.y, backPath, p), {x, y}];
}

function getClosestEnemyPath(p) {
	let enemies = players.filter(e => e.t !== p.t && e.hp > 0);
	let length = null;
	let paths = _(enemies)
		.flatMap(e => getNeighboors(e.x, e.y))
		.filter(e => map[e.x][e.y] === '.')
		.uniqBy(a => `${a.x}-${a.y}`)
		.map(e => getPath(p, e))
		.compact()
		.map(a => a.slice(1))
		.sortBy(['length'])
		.takeWhile(a => {
			const shouldTake = length === null || a.length === length;
			length = a.length;

			return shouldTake;
		})
		.value();


	return getNextPath(paths, p);
}

function getNextPath(possiblePaths) {
	possiblePaths = possiblePaths.sort((p1, p2) =>
		p1[p1.length - 1].y === p2[p2.length - 1].y
			? p1[p1.length - 1].x - p2[p2.length - 1].x
			: p1[p1.length - 1].y - p2[p2.length - 1].y);

	return possiblePaths[0];
}

function getPath(p, to) {
	const steps = [];
	const backPath = {};
	const neighboors = getNeighboors(p.x, p.y);
	neighboors.forEach(n => {
		backPath[`${n.x}-${n.y}`] = {x: p.x, y: p.y};
		steps.push(n);
	});

	const visited = {[p.x]: {[p.y]: true}};

	while (steps.length > 0) {
		const {x, y} = steps.shift();
		if (_.get(visited, [x, y]) || map[x][y] === '#') {
			continue;
		}

		_.set(visited, [x, y], true);
		if (to.x === x && to.y === y) {
			return backTrack(x, y, backPath, p);
		} else if (map[x][y] === '.') {
			const neighboors = getNeighboors(x, y, visited);
			neighboors.forEach(n => {
				backPath[`${n.x}-${n.y}`] = backPath[`${n.x}-${n.y}`] || {x, y};
				steps.push(n);
			});
		}
	}
}

let endBattle = false;
let round = 0;
let didntFinish = false;
drawMap();
while (!endBattle) {
	// console.log(`################# ROUND ${round} ###################`);
	let someOneMoved = false;
	players = _.sortBy(players, ['y', 'x']).filter(p => p.hp > 0);

	players.forEach(p => {
		if (p.hp <= 0) {
			return;
		}

		if (endBattle) {
			didntFinish = true;
			return;
		}

		const nextEnemy =
		_(getNeighboors(p.x, p.y))
			.map(e => map[e.x][e.y])
			.filter(e => !!e.t && e.t !== p.t)
			.sortBy(['hp'])
			.head();

		if (nextEnemy) {
			map[nextEnemy.x][nextEnemy.y].hp -= 3;
			if (map[nextEnemy.x][nextEnemy.y].hp <= 0) {
				map[nextEnemy.x][nextEnemy.y] = '.';
			}

			someOneMoved = true;
		} else {
			const nextEnemyPath = getClosestEnemyPath(p);
			if (nextEnemyPath) {
				map[p.x][p.y] = '.';
				const path = nextEnemyPath[0];

				p.x = path.x;
				p.y = path.y;
				map[p.x][p.y] = p;

				someOneMoved = true;

				const nextEnemy =
				_(getNeighboors(p.x, p.y))
					.map(e => map[e.x][e.y])
					.filter(e => !!e.t && e.t !== p.t)
					.sortBy(['hp'])
					.head();

				if (nextEnemy) {
					map[nextEnemy.x][nextEnemy.y].hp -= 3;
					if (map[nextEnemy.x][nextEnemy.y].hp <= 0) {
						map[nextEnemy.x][nextEnemy.y] = '.';
					}
				}
			}
		}

		const roundWon = _(players)
			.filter(p => p.hp > 0)
			.partition(p => p.t === 'G')
			.filter(a => !_.isEmpty(a))
			.value().length < 2;

		endBattle = endBattle || roundWon;
	});

	//drawMap();

	if (!didntFinish) {
		round++;
	}

	endBattle = endBattle || !someOneMoved;

	if (round === -1) {
		break;
	}
}

const hitSum = players.reduce((acc, p) => {
	if (p.hp > 0) {
		acc += p.hp;
	}

	return acc;
}, 0);

console.log(round, hitSum, (round) * hitSum);
console.log(players.filter(p => p.hp > 0));

function drawMap() {
	const transposed = _.unzip(map);
	let str = '';

	for (let y = 0; y < transposed.length; y++) {
		for (let x = 0; x < transposed[y].length; x++) {
			str += transposed[y][x].t || transposed[y][x];
		}
		str += '\n';
	}

	console.log(str, _.sortBy(players, ['y', 'x']));
}