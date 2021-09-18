import fs from 'fs';

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

interface BridgePart {
	a: number;
	b: number;
	size: number;
}

interface Bridge {
	bridge: Set<BridgePart>,
	linker: number;
}

const bridgePartsMap: Record<number, Set<BridgePart>> = {};

function buildBridgePart(partStr: string) {
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
const nextBridgesToCheck: Bridge[] = [];

function createBridge(oldBridge: Set<BridgePart>, linker: number) {
	const retVal = {
		bridge: new Set(oldBridge),
		linker
	};

	return retVal;
}

function getNextLinker(part: BridgePart, usedLink: number) {
	let nextLinker;

	if (part.a === usedLink) {
		nextLinker = part.b;
	} else {
		nextLinker = part.a;
	}

	return nextLinker;
}

function getNextBridges(bridgeObj: Bridge) {
	const retVal: Bridge[] = [];

	const nextParts = Array.from(bridgePartsMap[bridgeObj.linker])
		.filter(p => !bridgeObj.bridge.has(p));

	nextParts.forEach(np => {
		const nextBridge = createBridge(bridgeObj.bridge, getNextLinker(np, bridgeObj.linker));
		nextBridge.bridge.add(np);

		retVal.push(nextBridge);
	});

	return retVal;
}

nextBridgesToCheck.push(...getNextBridges(createBridge(new Set(), 0)));

while (nextBridgesToCheck.length > 0) {
	const bridgeToCheck = nextBridgesToCheck.pop()!;

	bridges.push(bridgeToCheck);

	nextBridgesToCheck.push(...getNextBridges(bridgeToCheck));
}

let maxSize = -Infinity;

bridges.forEach(b => {
	let bSize = 0;

	b.bridge.forEach(obj => {
		bSize += obj.size;
	});

	maxSize = Math.max(maxSize, bSize);
});

console.log(`Max size = ${maxSize}`);