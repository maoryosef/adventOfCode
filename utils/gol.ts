export function gameOfLife<K>(
	grid: Map<K, boolean>,
	getNeighbors: (k: K) => K[],
	isActive: (current: boolean, activeNeighbors: number, k: K) => boolean) {
	const nextGrid = new Map();

	for (const k of [...grid.keys()]) {
		const neighbors = getNeighbors(k);
		for (const n of neighbors) {
			if (!grid.has(n)) {
				grid.set(n, false);
			}
		}
	}

	for (const [k, v] of grid) {
		const activeNeighbors = getNeighbors(k).filter(n => !!grid.get(n)).length;

		nextGrid.set(k, isActive(v, activeNeighbors, k));
	}

	return nextGrid;
}