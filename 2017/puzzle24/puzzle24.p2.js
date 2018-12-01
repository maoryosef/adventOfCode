const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const bridgePartsMap = {};

function buildBridgePart(partStr) {
	const parts = partStr.split('/');
	const a = parseInt(parts[0], 10);
	const b = parseInt(parts[1], 10);

	return {
		a,
		b,
		size: a+b
	};
}

input.split('\n').forEach(row => {
	const bridgePart = buildBridgePart(row);

	bridgePartsMap[bridgePart.a] = bridgePartsMap[bridgePart.a] || new Set();
	bridgePartsMap[bridgePart.b] = bridgePartsMap[bridgePart.b] || new Set();

	bridgePartsMap[bridgePart.a].add(bridgePart);
	bridgePartsMap[bridgePart.b].add(bridgePart);
});

const bridges = [];
const nextBridgesToCheck = [];

function createBridge(oldBridge, linker) {
	const retVal = {
		bridge: new Set(oldBridge),
		linker
	};

	return retVal;
}

function getNextLinker(part, usedLink) {
	let nextLinker = null;

	if (part.a === usedLink) {
		nextLinker = part.b;
	} else {
		nextLinker = part.a;
	}

	return nextLinker;
}

function getNextBridges(bridgeObj) {
	const retVal = [];

	const nextParts = Array.from(bridgePartsMap[bridgeObj.linker])
		.filter(p => !bridgeObj.bridge.has(p));

	nextParts.forEach(np => {
		const nextBridge = createBridge(bridgeObj.bridge, getNextLinker(np, bridgeObj.linker));
		nextBridge.bridge.add(np);

		retVal.push(nextBridge);
	});

	return retVal;
}

nextBridgesToCheck.push.apply(nextBridgesToCheck, getNextBridges(createBridge(new Set(), 0)));

while (nextBridgesToCheck.length > 0) {
	const bridgeToCheck = nextBridgesToCheck.pop();

	bridges.push(bridgeToCheck);

	nextBridgesToCheck.push.apply(nextBridgesToCheck, getNextBridges(bridgeToCheck));
}

let maxSize = -Infinity;
let longestBridge = 0;

bridges.forEach(b => {
	let bSize = 0;

	if (b.bridge.size >= longestBridge) {
		b.bridge.forEach(obj => {
			bSize += obj.size;
		});

		if (bSize > maxSize || longestBridge < b.bridge.size) {
			maxSize = bSize;
		}

		longestBridge = b.bridge.size;
	}
});

console.log(`Max size = ${maxSize}`);