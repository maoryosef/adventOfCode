'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');
const {drawSvg} = require('aoc-utils').drawUtils;

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const WIDTH=25;
const HEIGHT=6;

function stackLayers(layers) {
	const image = [];

	for (let layer of layers) {
		for (let i = 0; i < HEIGHT; i++) {
			image[i] = image[i] || new Array(WIDTH);
			for (let j = 0; j < WIDTH; j ++) {
				if (_.isNil(image[i][j]) || image[i][j] === 2) {
					image[i][j] = layer[i][j];
				}
			}
		}
	}

	return image;
}

const layers = _(input)
	.split('')
	.map(num => parseInt(num))
	.thru(arr => _.chunk(arr, WIDTH * HEIGHT))
	.map(arr => _.chunk(arr, WIDTH))
	.value();

const image = stackLayers(layers);

console.log(drawSvg(image, {0: '#000', 1: '#FFF'}, 5));