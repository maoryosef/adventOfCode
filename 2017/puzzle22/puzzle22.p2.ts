import fs from 'fs';
import _ from 'lodash';
import progress from 'cli-progress';

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

type Grid = Record<number, Record<number, string>>;
const inputGrid: Grid = {};

const rows = input.split('\n');

const middle = Math.floor(rows.length / 2);

for (let y = 0; y < rows.length; y++) {
	inputGrid[y - middle] = {};
	const cols = rows[y].split('');
	for (let x = 0; x < cols.length; x++) {
		inputGrid[y - middle][x - middle] = cols[x];
	}
}
interface Point {
	x: number;
	y: number;
}
interface Carrier {
	dir: string;
	pos: Point;
}

const carrier: Carrier = {
	pos: { x: 0, y: 0 },
	dir: 'U'
};

function turnLeft(car: Carrier) {
	switch (car.dir) {
		case 'U':
			car.dir = 'L';
			break;
		case 'L':
			car.dir = 'D';
			break;
		case 'D':
			car.dir = 'R';
			break;
		case 'R':
			car.dir = 'U';
			break;
	}
}

function turnRight(car: Carrier) {
	switch (car.dir) {
		case 'U':
			car.dir = 'R';
			break;
		case 'L':
			car.dir = 'U';
			break;
		case 'D':
			car.dir = 'L';
			break;
		case 'R':
			car.dir = 'D';
			break;
	}
}

function reverseDir(car: Carrier) {
	switch (car.dir) {
		case 'U':
			car.dir = 'D';
			break;
		case 'L':
			car.dir = 'R';
			break;
		case 'D':
			car.dir = 'U';
			break;
		case 'R':
			car.dir = 'L';
			break;
	}
}

function turnCarrier(car: Carrier, grid: Grid) {
	const { x, y } = car.pos;

	if (grid[y][x] === '.') {
		turnLeft(car);
	} else if (grid[y][x] === '#') {
		turnRight(car);
	} else if (grid[y][x] === 'F') {
		reverseDir(car);
	}
}

function toggleNode(car: Carrier, grid: Grid) {
	const { x, y } = car.pos;

	if (grid[y][x] === '.') {
		grid[y][x] = 'W';
	} else if (grid[y][x] === 'W') {
		grid[y][x] = '#';
		return true;
	}

	if (grid[y][x] === '#') {
		grid[y][x] = 'F';
	} else if (grid[y][x] === 'F') {
		grid[y][x] = '.';
	}

	return false;
}

function moveForward(car: Carrier, grid: Grid) {
	switch (car.dir) {
		case 'U':
			car.pos.y--;
			break;
		case 'L':
			car.pos.x--;
			break;
		case 'R':
			car.pos.x++;
			break;
		case 'D':
			car.pos.y++;
			break;
	}

	if (!_.get(grid, `${car.pos.y}.${car.pos.x}`)) {
		_.set(grid, `${car.pos.y}.${car.pos.x}`, '.');
	}
}

const bar1 = new progress.Bar({
	hideCursor: true,
	barsize: 30
}, progress.Presets.legacy);

const BURSTS = 10000000;
let infectionBurstsCount = 0;

bar1.start(BURSTS / 1000, 0);

for (let i = 0; i < BURSTS; i++) {
	turnCarrier(carrier, inputGrid);

	if (toggleNode(carrier, inputGrid)) {
		infectionBurstsCount++;
	}

	moveForward(carrier, inputGrid);
	bar1.update(Math.floor(i / 1000));
}

bar1.update(BURSTS / 1000);
bar1.stop();
console.log(`${infectionBurstsCount} caused infections`);
