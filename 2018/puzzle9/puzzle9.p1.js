'use strict';
const _ = require('lodash');

/**
 *  10 players; last marble is worth 1618 points: high score is 8317
	13 players; last marble is worth 7999 points: high score is 146373
	17 players; last marble is worth 1104 points: high score is 2764
	21 players; last marble is worth 6111 points: high score is 54718
	30 players; last marble is worth 5807 points: high score is 37305
 */
const PLAYERS = 416;
const MARBLES = 71617;

let currentPlayer = 3;
let nextMarble = 3;
let currentMarbleIdx = 1;
let circle = [0, 2, 1];
let score = {};

while (nextMarble < MARBLES) {
	if (nextMarble % 23 === 0) {
		score[currentPlayer] = score[currentPlayer] || 0;

		score[currentPlayer] += nextMarble;
		currentMarbleIdx -= 7;

		if (currentMarbleIdx < 0) {
			currentMarbleIdx += circle.length;
		}

		const [val] = circle.splice(currentMarbleIdx, 1);
		score[currentPlayer] += val;
	} else {
		currentMarbleIdx += 2;
		if (currentMarbleIdx === circle.length) {
			circle.push(nextMarble);
		} else if (currentMarbleIdx > circle.length) {
			circle.splice(1, 0, nextMarble);
			currentMarbleIdx = 1;
		} else {
			circle.splice(currentMarbleIdx, 0, nextMarble);
		}
	}

	nextMarble++;
	currentPlayer++;
	if (currentPlayer > PLAYERS) {
		currentPlayer = 1;
	}
}
const highScore = _(score)
	.toPairs()
	.sortBy(pair => pair[1])
	.takeRight()
	.fromPairs()
	.value();

console.log(highScore);