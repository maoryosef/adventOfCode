YEAR=2019
PUZZLE=$1

DIR="./$YEAR/puzzle$PUZZLE"
mkdir -p $DIR/__TESTS__

cp ./template/puzzle.js "$DIR/puzzle$PUZZLE.p1.js"
cp ./template/puzzle.js "$DIR/puzzle$PUZZLE.p2.js"
sed "s/<PNUM>/$PUZZLE/" ./template/puzzle.test.template.js > "$DIR/__TESTS__/puzzle$PUZZLE.test.js"

touch "$DIR/__TESTS__/input.test.1.txt"
touch "$DIR/__TESTS__/input.txt"