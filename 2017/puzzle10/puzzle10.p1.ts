const ARRAY_LENGTH = 256;
const initialArray = generateInitialArray(ARRAY_LENGTH);
const input = '197,97,204,108,1,29,5,71,0,50,2,255,248,78,254,63';
let currPosition = 0;
let skipSize = 0;

const inputLengths = input.split(',').map(val => parseInt(val, 10));

function generateInitialArray(length: number) {
	const retVal = [];

	for (let i = 0; i < length; i++) {
		retVal.push(i);
	}

	return retVal;
}

function reverseIndices(arr: number[], indicesToReverse: number[]) {
	for (let i = 0; i < indicesToReverse.length / 2; i++) {
		const idxA = indicesToReverse[i];
		const idxB = indicesToReverse[indicesToReverse.length - 1 - i];
		const temp = arr[idxA];
		arr[idxA] = arr[idxB];
		arr[idxB] = temp;
	}
}

inputLengths.forEach(jumpLength => {
	let indicesToReverse = [];
	for (let i = 0; i < jumpLength; i++) {
		indicesToReverse.push((i + currPosition) % ARRAY_LENGTH);
	}

	reverseIndices(initialArray, indicesToReverse);
	currPosition = (currPosition + skipSize + jumpLength) % ARRAY_LENGTH;
	skipSize++;
	indicesToReverse;
});

initialArray;
skipSize;
currPosition;
console.log(initialArray[0] * initialArray[1]);

export {}