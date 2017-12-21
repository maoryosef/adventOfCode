let input = `set i 31
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
jgz a -19`

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
const registers = {};
let lastPlayedSound = null;
let recoveredSound = null;

const set = (a, b) => {registers[a] = resolveValue(b)};
const add = (a, b) => {registers[a] = resolveValue(a) + resolveValue(b)};
const mul = (a, b) => {registers[a] = resolveValue(a) * resolveValue(b)};
const mod = (a, b) => {registers[a] = resolveValue(a) % resolveValue(b)};
const snd = (a) => {playSound(resolveValue(a))};
const rcv = (a) => resolveValue(a) > 0 ? recoverSound() : null;
const jgz = (a, b) => resolveValue(a) > 0 ? resolveValue(b) : 0;

function resolveValue(val) {
    const asNumber = parseInt(val, 10);
    if (!isNaN(asNumber)) {
        return asNumber;
    }

    registers[val] = registers[val] || 0;

    return registers[val];
}

function recoverSound() {
    recoveredSound = lastPlayedSound;
    return true;
}

function playSound(val) {
    lastPlayedSound = val;
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
//set a 1
//snd a
const PARSE_REGEX = /^([^\s]+?)\s+([^\s]+?)(?:\s+([^\s]+)|$)/

let cursor = 0;

while (cursor < commands.length) {
    const cmd = commands[cursor];
    const tokenized = cmd.match(PARSE_REGEX);
    const operand = tokenized[1];
    const a = tokenized[2];
    const b = tokenized[3];

    const res = TOKENS[operand](a, b);

    if (res === true) {
        console.log(`first recovered sound ${recoveredSound}`);
        return;
    } else if (res) {
        cursor += res;
    } else {
        cursor++;
    }
}
