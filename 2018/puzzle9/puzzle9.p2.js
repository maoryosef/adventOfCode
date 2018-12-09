'use strict';
const _ = require('lodash');
const progress = require('cli-progress');

const bar1 = new progress.Bar({
	barCompleteChar: '\u2588',
	barIncompleteChar: '\u2591',
	hideCursor: true
}, progress.Presets.legacy);

/**
 *  10 players; last marble is worth 1618 points: high score is 8317
	13 players; last marble is worth 7999 points: high score is 146373
	17 players; last marble is worth 1104 points: high score is 2764
	21 players; last marble is worth 6111 points: high score is 54718
	30 players; last marble is worth 5807 points: high score is 37305
 */
const PLAYERS = 416;
const MARBLES = 7161700;
const marbleRoot = {
	val: 0,
	next: null,
	prev: null
};

let currentMarble = marbleRoot;

let currentPlayer = 1;
let nextMarble = 1;
let score = {};

bar1.start(MARBLES, nextMarble);

while (nextMarble <= MARBLES) {
	if (nextMarble % 23 === 0) {
		score[currentPlayer] = score[currentPlayer] || 0;

		score[currentPlayer] += nextMarble;

		for (let i = 0; i < 7; i++) {
			currentMarble = currentMarble.prev;
		}

		const val = currentMarble.val;
		score[currentPlayer] += val;

		currentMarble.next.prev = currentMarble.prev;
		currentMarble.prev.next = currentMarble.next;
		currentMarble = currentMarble.next;
	} else {
		const newMarble = {
			val: nextMarble
		};

		if (!currentMarble.next) {
			currentMarble.next = newMarble;
			newMarble.prev = currentMarble;
			newMarble.next = marbleRoot;
			marbleRoot.prev = newMarble;
		} else {
			const oldNext = currentMarble.next.next;
			newMarble.next = oldNext;
			oldNext.prev = newMarble;
			currentMarble.next.next = newMarble;
			newMarble.prev = currentMarble.next;
		}

		currentMarble = newMarble;
	}

	nextMarble++;
	currentPlayer++;
	if (currentPlayer > PLAYERS) {
		currentPlayer = 1;
	}

	if (nextMarble % 100 === 0) {
		bar1.update(nextMarble);
	}
}
const highScore = _(score)
	.toPairs()
	.sortBy(pair => pair[1])
	.takeRight()
	.fromPairs()
	.value();

bar1.update(MARBLES);
bar1.stop();

console.log(highScore);