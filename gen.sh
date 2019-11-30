YEAR=2019
PUZZLE=$1

DIR="./$YEAR/puzzle$PUZZLE"
mkdir -p $DIR

cp ./template/puzzle.js "$DIR/puzzle$PUZZLE.p1.js"
cp ./template/puzzle.js "$DIR/puzzle$PUZZLE.p2.js"

touch "$DIR/input.test.txt"
touch "$DIR/input.txt"