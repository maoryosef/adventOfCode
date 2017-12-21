function calculateKnotHash(arrayLength, inputLengthsString) {
    function generateInitialArray() {
        retVal = [];
    
        for (let i = 0; i < arrayLength; i++) {
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
    
    const initialArray = generateInitialArray();
    const inputLengths = Array.from(inputLengthsString.trim()).map(val => val.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
    let currPosition = 0;
    let skipSize = 0;

    for (let round = 0; round < 64; round++) {
        inputLengths.forEach(jumpLength => {
            let indicesToReverse = [];
            for (let i = 0; i < jumpLength; i++) {
                indicesToReverse.push((i + currPosition) % arrayLength)
            }
        
            reverseIndices(initialArray, indicesToReverse);
            currPosition = (currPosition + skipSize + jumpLength) % arrayLength;
            skipSize++
        });
    }

    return calculateSequence(initialArray);
}

let count1 = 0;
for (let i = 0; i < 128; i++) {
    const hashValue = calculateKnotHash(256, `hfdlxzhv-${i}`);
    const asBinarry = Array.from(hashValue).reduce((acc, digit) => acc.concat(`0000${parseInt(digit, 16).toString(2)}`.slice(-4)), '')
    
    count1 += Array.from(asBinarry).filter(val => val === '1').length
}

count1