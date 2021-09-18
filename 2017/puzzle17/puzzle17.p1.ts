let buffer = [0];
const steps = 363;
let currentPos = 0;

for (let i = 1; i < 2018; i++) {
	currentPos = (currentPos + 1 + steps) % buffer.length;
	buffer.splice(currentPos + 1, 0, i);
}

currentPos;

console.log(buffer[currentPos + 2]);

export {}