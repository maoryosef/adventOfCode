const fs = require('fs');

class BasePuzzle {
	parseInput() {
		throw new Error('parseInput not implemented');
	}

	solve1() {
		throw new Error('solve1 not implemented');
	}

	solve2() {
		throw new Error('solve2 not implemented');
	}

	#exec(inputFilename, solver, inputStr) {
		const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

		const parsedInput = this.parseInput(input);

		return solver(parsedInput);
	}

	exec1(inputFilename) {
		return this.#exec(inputFilename, this.solve1);
	}
	exec2(inputFilename) {
		return this.#exec(inputFilename, this.solve2);
	}
}

module.exports = {
	BasePuzzle
};