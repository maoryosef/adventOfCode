'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return _.padStart(parseInt(row, 16).toString(2), 4, '0');
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('')
		.map(parseRow)
		.join('');

	return parsedInput;
}

function parsePacket(packet, limit = Infinity) {
	const packets = [];
	let pIdx = 0;

	while (pIdx < packet.length && packets.length !== limit) {
		if (!packet.slice(pIdx).includes('1')) {
			break;
		}

		const version = parseInt(packet.slice(pIdx, pIdx + 3), 2);
		const type = parseInt(packet.slice(pIdx + 3, pIdx + 6), 2);
		pIdx += 6;
		const value = {};

		if (type === 4) {
			let done = false;
			let literal = '';
			while (!done) {
				if (packet[pIdx] === '0') {
					done = true;
				}
				literal += packet.slice(pIdx + 1, pIdx + 5);
				pIdx += 5;
			}

			value.literal = parseInt(literal, 2);
		} else {
			const lengthType = packet[pIdx];
			pIdx++;
			if (lengthType === '0') {
				const packetsSize = parseInt(packet.slice(pIdx, pIdx + 15), 2);
				if (isNaN(packetsSize)) {
					break;
				}
				pIdx += 15;
				const {packets, length} = parsePacket(packet.slice(pIdx, pIdx + packetsSize));
				value.packets = packets;
				pIdx += length;
			} else {
				const packetsCount = parseInt(packet.slice(pIdx, pIdx + 11), 2);
				if (isNaN(packetsCount)) {
					break;
				}
				pIdx += 11;
				const {packets, length} = parsePacket(packet.slice(pIdx), packetsCount);
				value.packets = packets;
				pIdx += length;
			}
		}

		packets.push({version, type, value});
	}

	return {
		packets,
		length: pIdx
	};
}

function solve1(input) {
	const parsedPacket = parsePacket(input);
	let versionSum = 0;
	const queue = [parsedPacket.packets[0]];

	while (queue.length) {
		const curr = queue.shift();
		curr;
		versionSum += curr.version;

		if (curr.type !== 4) {
			queue.push(...curr.value.packets);
		}
	}

	return versionSum;
}

const sum = arr => arr.reduce((acc, v) => acc + v, 0);
const product = arr => arr.reduce((acc, v) => acc * v, 1);

function calcPackets(packet) {
	if (packet.type === 4) {
		return packet.value.literal;
	}

	if (packet.type === 0) {
		return sum(packet.value.packets.map(p => calcPackets(p)));
	}

	if (packet.type === 1) {
		return product(packet.value.packets.map(p => calcPackets(p)));
	}

	if (packet.type === 2) {
		return Math.min(...packet.value.packets.map(p => calcPackets(p)));
	}

	if (packet.type === 3) {
		return Math.max(...packet.value.packets.map(p => calcPackets(p)));
	}

	if (packet.type === 5) {
		return calcPackets(packet.value.packets[0]) > calcPackets(packet.value.packets[1]) ? 1 : 0;
	}

	if (packet.type === 6) {
		return calcPackets(packet.value.packets[0]) < calcPackets(packet.value.packets[1]) ? 1 : 0;
	}

	if (packet.type === 7) {
		return calcPackets(packet.value.packets[0]) === calcPackets(packet.value.packets[1]) ? 1 : 0;
	}
}

function solve2(input) {
	const parsedPacket = parsePacket(input);

	return calcPackets(parsedPacket.packets[0]);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};