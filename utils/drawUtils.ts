import _ from 'lodash';

export function drawSvg(image: string[][], valueMap: Record<string, number>, factor: number) {
	const height = image.length;
	const width = image[0].length;

	let str = `<html><div style="display: block"></div><br/><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width * factor}" height="${height * factor}" style="border: 1px solid black">`;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const fill = valueMap[image[y][x]];
			str += `<rect width="${factor}" height="${factor}" x="${x * factor}" y="${y * factor}" fill="${fill}"></rect>`;
		}
	}

	str += '</svg></html>';

	return str;
}

export function drawAscii(image: number[][], valueMap = {0: ' ', 1: '#'}, factor = 1) {
	let str = '';

	const getVal = (val: number) => valueMap[val as keyof typeof valueMap] || '!';

	for (let y = 0; y < image.length; y++) {
		for (let x = 0; x < image[y].length; x++) {
			str += _.repeat(getVal(image[y][x]), factor);
		}
		str += '\n';
	}

	return str;
}
