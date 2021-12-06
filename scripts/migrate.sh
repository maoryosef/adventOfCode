migrate() {
	git mv "$1" "${1%.*}.ts"
}

for file in $1/**/*.js ; do
  migrate $file
done

for file in $1/**/__TESTS__/*.js ; do
  migrate $file
done


#const (.*?) = require\(('.*?')\)(;|\.default)"
#import $1 from $2;"

#import \{join\} from 'path';
#const {join} = require('path')

#function exec\(inputFilename, solver, inputStr\) \{
#function exec(inputFilename: string, solver: Function, inputStr?: string) {

#module\.exports = \{
#export default {

#\(inputFilename\) => exec
#(inputFilename: string) => exec

#function parseInput\(input\) \{
#function parseInput(input: string) {

#\.thru\(fs\.readdirSync\)
#.thru((dir: string) => fs.readdirSync(dir))

#const getPath = filename =>
#const getPath = (filename: string) =>

#function parseRow\(row\) \{
#function parseRow(row: string) {