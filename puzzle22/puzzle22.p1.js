const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const inputGrid = {};

const rows = input.split('\n');

const middle = Math.floor(rows.length / 2);

for (let y = 0; y < rows.length; y++) {
    inputGrid[y - middle] = {};
    const cols = rows[y].split('');
    for (let x = 0; x < cols.length; x++) {
        inputGrid[y - middle][x - middle] = cols[x]
    }
}

const carrier = {
    pos: {x: 0, y: 0},
    dir: 'U'
}

function turnLeft(car) {
    switch (car.dir) {
        case 'U':
            car.dir = 'L'
        break;
        case 'L':
            car.dir = 'D'
        break;
        case 'D':
            car.dir = 'R'
        break;
        case 'R':
            car.dir = 'U'
        break;
    }
}

function turnRight(car) {
    switch (car.dir) {
        case 'U':
            car.dir = 'R'
        break;
        case 'L':
            car.dir = 'U'
        break;
        case 'D':
            car.dir = 'L'
        break;
        case 'R':
            car.dir = 'D'
        break;
    }
}

function turnCarrier(car, grid) {
    const {x,y} = car.pos;

    if (grid[y][x] === '.') {
        turnLeft(car);
    } else {
        turnRight(car);
    }
}

function toggleNode(car, grid) {
    const {x,y} = car.pos;
    
    if (grid[y][x] === '.') {
        grid[y][x] = '#'
        return true;
    }

    grid[y][x] = '.'

    return false;
}

function moveForward(car, grid) {
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

const BURSTS = 10000;
let infectionBurstsCount = 0;

for (let i = 0; i < BURSTS; i++) {
    turnCarrier(carrier, inputGrid);
    
    if (toggleNode(carrier, inputGrid)) {
        infectionBurstsCount++;
    }

    moveForward(carrier, inputGrid);
}

infectionBurstsCount