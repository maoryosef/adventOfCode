//#region input
const input = `set i 31
set a 1
mul p 17
jgz p p
mul a 2
add i -1
jgz i -2
add a -1
set i 127
set p 680
mul p 8505
mod p a
mul p 129749
add p 12345
mod p a
set b p
mod b 10000
snd b
add i -1
jgz i -9
jgz a 3
rcv b
jgz b -1
set f 0
set i 126
rcv a
rcv b
set p a
mul p -1
add p b
jgz p 4
snd a
set a b
jgz 1 3
snd b
set f 1
add i -1
jgz i -11
snd a
jgz f -16
jgz a -19`;
//#endregion

// input = `set a 1
// add a 2
// mul a a
// mod a 5
// snd a
// set a 0
// rcv a
// jgz a -1
// set a 1
// jgz a -2`;

const commands = input.split(/\n/);

interface MessageQueue {
	0: Array<string | number>;
	1: Array<string | number>;
}

const MESSAGE_QUEUE: MessageQueue = {
	0: [],
	1: []
};

const SEND_COUNTER = {
	0: 0,
	1: 0
};

const set = (registers: Registers,a: string, b: string) => {registers[a] = resolveValue(registers, b);};
const add = (registers: Registers,a: string, b: string) => {registers[a] = resolveValue(registers, a) + resolveValue(registers, b);};
const mul = (registers: Registers,a: string, b: string) => {registers[a] = resolveValue(registers, a) * resolveValue(registers, b);};
const mod = (registers: Registers,a: string, b: string) => {registers[a] = resolveValue(registers, a) % resolveValue(registers, b);};
const snd = (registers: Registers,a: string) => {sendMessage(registers, resolveValue(registers, a));};
const rcv = (registers: Registers,a: string) => recieveMessage(registers, a);
const jgz = (registers: Registers,a: string, b: string) => resolveValue(registers, a) > 0 ? resolveValue(registers, b) : 0;

function sendMessage(registers: Registers, val: number) {
	const programToSend = registers.progId === 0 ? 1 : 0;
	MESSAGE_QUEUE[programToSend].push(val);
	SEND_COUNTER[registers.progId]++;
}

let progAWaiting = false;
let progBWaiting = false;
function recieveMessage(registers: Registers, register: string) {
	let checkCounts = 0;
	return new Promise(resolve => {
		const checkMessage = () => {
			if (progAWaiting && progBWaiting) {
				resolve(null);
				return;
			}
			if (MESSAGE_QUEUE[registers.progId].length > 0) {
				const message = MESSAGE_QUEUE[registers.progId].splice(0, 1);
				set(registers, register, message[0] as string);
				resolve(null);
			} else {
				checkCounts++;
				if (checkCounts > 1) {
					if (registers.progId === 0) {
						progAWaiting = true;
					} else {
						progBWaiting = true;
					}
				}
				setTimeout(checkMessage, 1);
			}
		};

		checkMessage();
	});
}

function resolveValue(registers: Registers, val: string): number {
	const asNumber = parseInt(val, 10);
	if (!isNaN(asNumber)) {
		return asNumber;
	}

	registers[val] = registers[val] || 0;

	return registers[val];
}

const TOKENS = {
	'set': set,
	'add': add,
	'mul': mul,
	'mod': mod,
	'snd': snd,
	'rcv': rcv,
	'jgz': jgz
};
const PARSE_REGEX = /^([^\s]+?)\s+([^\s]+?)(?:\s+([^\s]+)|$)/;

interface Registers {
	progId: 0 | 1;
	[reg: string]: number;
}

async function runProgram(progId: 0 | 1) {
	const registers: Registers = {
		progId,
		p: progId
	};

	let cursor = 0;

	while (cursor < commands.length) {
		const cmd = commands[cursor];
		const tokenized = cmd.match(PARSE_REGEX)!;
		const operand = tokenized[1] as keyof typeof TOKENS;
		const a = tokenized[2];
		const b = tokenized[3];

		const res = await TOKENS[operand](registers, a, b);

		if (progAWaiting && progBWaiting) {
			return;
		}

		if (res) {
			cursor += res as number;
		} else {
			cursor++;
		}
	}
}

Promise.all([runProgram(0), runProgram(1)]).then(() => {
	console.log('done', SEND_COUNTER[1]);
});

export {}