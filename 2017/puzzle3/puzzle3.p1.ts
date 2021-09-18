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

while (i < target) {
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

	if (i === minTarget ** 2) {
		radius++;
		minTarget += 2;
	}
}

i;

console.log(radius, minTarget, minTarget ** 2,  i - minTarget ** 2, (i - minTarget ** 2) / 5);
console.log(curX, curY, Math.abs(curX) + Math.abs(curY));

export {}