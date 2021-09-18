const target = 289326;

let i = 1;
let minTarget = 3;
let radius = 1;
let curX = 0;
let curY = 0;
let goLeft = false;
let goRight = true;
let goUp = false;
let goDown = false;
const blocks: Record<number, Record<number, number>> = {0: {0: 1}};
let res = 0;
const resArray = [1];

function calcSiblings(x: number, y: number) {
	let res = 0;

	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			if (blocks[x + i] && blocks[x + i][y + j]) {
				res += blocks[x + i][y + j];
			}
		}
	}

	return res;
}

let found = false;
while (!found) {
	i += 1;

	if (curX === radius && goRight) {
		goRight = false;
		goUp = true;
	}

	if (curX === -radius && goLeft) {
		goLeft = false;
		goDown = true;
	}

	if (curY === radius && goDown) {
		goDown = false;
		goRight = true;
	}

	if (curY === -radius && goUp) {
		goUp = false;
		goLeft = true;
	}

	curX += goLeft ? -1 : 0;
	curX += goRight ? 1 : 0;
	curY += goUp ? -1 : 0;
	curY += goDown ? 1 : 0;

	blocks[curX] = blocks[curX] || {};
	blocks[curX][curY] = calcSiblings(curX, curY);

	resArray.push(blocks[curX][curY]);
	if (blocks[curX][curY] > target) {
		res = blocks[curX][curY];
		found = true;
	}

	if (i === minTarget ** 2) {
		radius++;
		minTarget += 2;
	}
}

i;
console.log(res);
console.log(radius, minTarget, minTarget ** 2,  i - minTarget ** 2, (i - minTarget ** 2) / 5);
console.log(curX, curY, Math.abs(curX) + Math.abs(curY));
console.log(resArray);

export {}