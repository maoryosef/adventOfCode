/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest/presets/js-with-ts-esm',
	testEnvironment: 'node',
	globals: {
		TEST_MODE: true,
		extensionsToTreatAsEsm: ['.ts', '.js'],
		'ts-jest': {
			useESM: true
		}
	},
	transformIgnorePatterns: [
		'node_modules/(?!(js-combinatorics)/)'
	]
};