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

const grid = [];

let count1 = 0;
for (let i = 0; i < 128; i++) {
    grid[i] = []
    const hashValue = calculateKnotHash(256, `hfdlxzhv-${i}`);
    const asBinarry = Array.from(hashValue).reduce((acc, digit) => acc.concat(`0000${parseInt(digit, 16).toString(2)}`.slice(-4)), '')
    
    Array.from(asBinarry).forEach(val => {
        grid[i].push(val === '1' ? true : 0);
    })
}

function calculateGroups(grid) {
    function calculateGroupsRec(y, x, groupNum) {
        if (y < 0 || 
            x < 0 ||
            y === grid.length || 
            x === grid[y].length || 
            grid[y][x] !== true) {
            return false;
        }

        grid[y][x] = groupNum;
        calculateGroupsRec(y, x + 1, groupNum);
        calculateGroupsRec(y, x - 1, groupNum);
        calculateGroupsRec(y + 1, x, groupNum);
        calculateGroupsRec(y - 1, x, groupNum);
    }

    let currentGroup = 1;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === true) {
                calculateGroupsRec(i , j, currentGroup);
                currentGroup++;
            }
        }
    }

    return currentGroup - 1;
}

console.log(calculateGroups(grid))