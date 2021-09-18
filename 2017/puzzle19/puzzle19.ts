import fs from 'fs';

const input = fs.readFileSync(`${__dirname}/prodInput.txt`, 'utf-8');
const inputMatrix: string[][] = [];

input.split('\n').forEach(line => {
	inputMatrix.push(line.split(''));
});

const entryPoint = inputMatrix[0].indexOf('|');
let letters = '';
let steps = 0;
function traverse(arr: string[][], x: number, y: number, dir: string) {
	let finish = false;
	while (!finish) {
		steps++;
		switch (dir) {
			case 'D': y += 1;
				break;
			case 'U': y -= 1;
				break;
			case 'L': x -= 1;
				break;
			case 'R': x += 1;
				break;
		}

		if ('+-|'.indexOf(arr[y][x]) === -1) {
			if (arr[y][x] === ' ') {
				return;
			}

			letters += arr[y][x];
		}

		if (arr[y][x] === '+') {
			if (dir === 'D' || dir === 'U') {
				if (arr[y][x - 1] !== ' ') {
					dir = 'L';
				} else if (arr[y][x + 1] !== ' ') {
					dir = 'R';
				}
			} else {
				if (arr[y + 1] && arr[y + 1][x] !== ' ') {
					dir = 'D';
				} else {
					dir = 'U';
				}
			}
		}
	}
}

traverse(inputMatrix, entryPoint, 0, 'D');
console.log(letters);
console.log(steps);