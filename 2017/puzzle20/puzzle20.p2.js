const fs = require('fs');
const progress = require('cli-progress');

const bar1 = new progress.Bar({
	hideCursor: true
}, progress.Presets.legacy);

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const rows = input.split('\n');


function parseRow(row) {
	const PARSE_REGEX = /^p=<(.*?),(.*?),(.*?)>.*v=<(.*?),(.*?),(.*?)>.*a=<(.*?),(.*?),(.*?)>$/;
	const parsed = row.match(PARSE_REGEX);

	parsed;
	return {
		pos: { x: parseInt(parsed[1].trim(), 10), y: parseInt(parsed[2].trim(), 10), z: parseInt(parsed[3].trim(), 10) },
		vel: { x: parseInt(parsed[4].trim(), 10), y: parseInt(parsed[5].trim(), 10), z: parseInt(parsed[6].trim(), 10) },
		acc: { x: parseInt(parsed[7].trim(), 10), y: parseInt(parsed[8].trim(), 10), z: parseInt(parsed[9].trim(), 10) }
	};
}

let particlesArray = [];
const RUNS = 1000000;
let idx = 0;
rows.forEach(row => {
	const parsedRow = parseRow(row);

	parsedRow.id = idx;
	particlesArray.push(parsedRow);
	idx++;
});
console.log(particlesArray.length);

bar1.start(RUNS, 0);

function insertToCollisionArrAndReturnCollisions(collisions, collisionsArr, p) {
	const { x, y, z } = p.pos;

	collisions[x] = collisions[x] || {};
	collisions[x][y] = collisions[x][y] || {};
	collisions[x][y][z] = collisions[x][y][z] || [];

	collisions[x][y][z].push(p.id);
	if (collisions[x][y][z].length > 1) {
		return collisionsArr.concat(collisions[x][y][z]);
	}

	return collisionsArr;
}

for (let i = 0; i < RUNS; i++) {
	let collisions = {};
	let collisionsArr = [];

	particlesArray.forEach(particle => {
		particle.vel.x += particle.acc.x;
		particle.vel.y += particle.acc.y;
		particle.vel.z += particle.acc.z;

		particle.pos.x += particle.vel.x;
		particle.pos.y += particle.vel.y;
		particle.pos.z += particle.vel.z;

		collisionsArr = insertToCollisionArrAndReturnCollisions(collisions, collisionsArr, particle);
	});

	const preLength = particlesArray.length;
	particlesArray = particlesArray.filter(particle => collisionsArr.indexOf(particle.id) === -1);

	if (preLength !== particlesArray.length) {
		console.log(particlesArray.length);
	}

	if (i % 1000 === 0) {
		bar1.update(i);
	}
}

particlesArray.sort((a, b) => {
	const aDis = Math.abs(a.pos.x) + Math.abs(a.pos.y) + Math.abs(b.pos.z);
	const bDis = Math.abs(b.pos.x) + Math.abs(b.pos.y) + Math.abs(b.pos.z);

	return aDis - bDis;
});

bar1.update(RUNS);
bar1.stop();

console.log(particlesArray.length);