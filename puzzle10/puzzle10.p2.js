const ARRAY_LENGTH = 256;
const initialArray = generateInitialArray(ARRAY_LENGTH);
let inputLengths = '197,97,204,108,1,29,5,71,0,50,2,255,248,78,254,63'.trim();
let currPosition = 0;
let skipSize = 0;

inputLengths = Array.from(inputLengths).map(val => val.charCodeAt(0)).concat([17, 31, 73, 47, 23]);

function generateInitialArray(length) {
    retVal = [];

    for (let i = 0; i < length; i++) {
        retVal.push(i);
    }

    return retVal;
}

function reverseIndices(arr, indicesToReverse) {
    for (let i = 0; i < indicesToReverse.length / 2; i++) {
        const idxA = indicesToReverse[i];
        const idxB = indicesToReverse[indicesToReverse.length - 1 - i];
        const temp = arr[idxA];
        arr[idxA] = arr[idxB]
        arr[idxB] = temp;
    }
}

for (let round = 0; round < 64; round++) {
    inputLengths.forEach(jumpLength => {
        let indicesToReverse = [];
        for (let i = 0; i < jumpLength; i++) {
            indicesToReverse.push((i + currPosition) % ARRAY_LENGTH)
        }
    
        reverseIndices(initialArray, indicesToReverse);
        currPosition = (currPosition + skipSize + jumpLength) % ARRAY_LENGTH;
        skipSize++
    });
}

function calculateSequence(arr) {
    let retVal = '';
    
    for (let i = 0; i < 16; i++) {
        let interm = 0;
        for (let j = 0; j < 16; j++) {
            interm ^= arr[j + 16 * i];
        }

        retVal += `0${interm.toString(16)}`.slice(-2);
    }

    return retVal;
}

console.log(calculateSequence(initialArray))