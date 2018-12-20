'use strict';
const fs = require('fs');
const _ = require('lodash');

let input = '^WNE$';
input = '^ENWWW(NEEE|SSE(EE|N))$';
input = '^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$';
input = '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$';
input = '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$';
input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const move = {
	W: ({x,y}) => ({x: x - 1, y, d: '|'}),
	E: ({x,y}) => ({x: x + 1, y, d: '|'}),
	N: ({x,y}) => ({x, y: y - 1, d: '-'}),
	S: ({x,y}) => ({x, y: y + 1, d: '-'}),
};

const instructions = _(input)
	.split('')
	.slice(1, -1)
	.value();

let currPos = {x: 0, y: 0};
//it starts in 1,1 because I am wrapping the map with walls at the end
const startPoint = {x: 1, y: 1};
const map = [['X']];
const branchStack = [];
instructions.forEach(inst => {
	if (inst === '(') {
		branchStack.push(currPos);
		return;
	}

	if (inst === '|') {
		currPos = branchStack[branchStack.length - 1];
		return;
	}

	if (inst === ')') {
		currPos = branchStack.pop();
		return;
	}

	let newPos = move[inst](currPos);

	if (newPos.x < 0) {
		addLeftColumn(newPos.y);
		recalcBranchStack(2, 0);
		newPos.x = 0;
	} else if (newPos.x === map[0].length) {
		addRightColumn(newPos.y);
		newPos.x = map[0].length - 1;
	} else if (newPos.y === map.length) {
		addBottomRow(newPos.x);
		newPos.y = map.length - 1;
	} else if (newPos.y < 0) {
		addTopRow(newPos.x);
		recalcBranchStack(0, 2);
		newPos.y = 0;
	} else {
		map[newPos.y][newPos.x] = newPos.d;
		newPos = move[inst](newPos);
		map[newPos.y][newPos.x] = '.';
	}

	currPos = newPos;
});

function recalcBranchStack(xOffset, yOffset) {
	startPoint.x += xOffset;
	startPoint.y += yOffset;
	branchStack.forEach(pos => {
		pos.x += xOffset;
		pos.y += yOffset;
	});
}

function addRightColumn(y) {
	map.forEach((r, idx) => {
		if (idx === y) {
			r.push('|', '.');
		} else {
			r.push('#', '#');
		}
	});
}

function addLeftColumn(y) {
	map.forEach((r, idx) => {
		if (idx === y) {
			r.unshift('.', '|');
		} else {
			r.unshift('#', '#');
		}
	});
}

function addTopRow(x) {
	const length = map[0].length;
	const firstLayer = _.repeat('#', length).split('');
	firstLayer[x] = '.';
	const secondLayer = firstLayer.slice(0);
	secondLayer[x] = '-';

	map.unshift(firstLayer, secondLayer);
}

function addBottomRow(x) {
	const length = map[0].length;
	const firstLayer = _.repeat('#', length).split('');
	firstLayer[x] = '-';
	const secondLayer = firstLayer.slice(0);
	secondLayer[x] = '.';

	map.push(firstLayer, secondLayer);
}

function wrapMap() {
	const mapLength = map[0].length;

	const tops = [..._.repeat('#', mapLength).split('')];
	map.unshift(tops.slice(0));
	map.push(tops.slice(0));

	map.forEach(r => {
		r.unshift('#');
		r.push('#');
	});
}

wrapMap();

function drawMap() {
	let str = '';
	map.forEach(r => {
		r.forEach(c => {
			str += c;
		});

		str += '\n';
	});

	console.log(str);
}

console.log(map[startPoint.y][startPoint.x]);
drawMap();


const visitedMap = {};
const backTrackMap = {};
const rooms = [];

const nextSteps = [startPoint];

while (nextSteps.length > 0) {
	const s = nextSteps.shift(1);
	const neighboors = getNeighboors(s);

	visitedMap[`${s.x},${s.y}`] = true;
	nextSteps.push(...neighboors);

	neighboors.forEach(n => {
		backTrackMap[`${n.x},${n.y}`] = s;
	});

	if (map[s.y][s.x] === '.') {
		rooms.push(s);
	}
}

function getNeighboors({x, y}) {
	const candidates = [
		{x: x + 1, y},
		{x: x - 1, y},
		{x, y: y + 1},
		{x, y: y - 1}
	];

	return candidates.filter(c => !visitedMap[`${c.x},${c.y}`] && map[c.y][c.x] !== '#');
}

function backTrack(room) {
	const path = [room];
	let loc = `${room.x},${room.y}`;
	while (backTrackMap[loc]) {
		const parentPos = backTrackMap[loc];
		path.unshift(parentPos);

		loc = `${parentPos.x},${parentPos.y}`;
	}

	return path.filter(({x, y}) => map[y][x] === '|' || map[y][x] === '-').length;
}

const backTrackedDoors = _(rooms)
	.map(backTrack)
	.filter(count => count >= 1000)
	.value()
	.length;

console.log(rooms);
console.log(backTrackedDoors);