function getPrimeFactors(n) {
	const factors = [];
	let divisor = 2;

	while (n > 1) {
		if (n % divisor == 0) {
			factors.push(divisor);
			n = n / divisor;
		} else {
			divisor++;
		}
	}

	return factors;
}

module.exports = {
	getPrimeFactors,
};
