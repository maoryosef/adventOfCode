YEAR=2023

PUZZLES=(`ls $YEAR`)

PUZZLE=1
for i in "${PUZZLES[@]}"
do
	if [[ $i =~ ^puzzle ]]; then
   		PUZZLE=$((PUZZLE+1))
	fi
done

DIR="./$YEAR/puzzle$PUZZLE"
mkdir -p $DIR/__TESTS__

cp ./template/puzzle.js "$DIR/puzzle$PUZZLE.js"
sed "s/<PNUM>/$PUZZLE/" ./template/puzzle.test.template.js > "$DIR/__TESTS__/puzzle$PUZZLE.test.js"

touch "$DIR/__TESTS__/input.test.1.txt"
touch "$DIR/__TESTS__/input.txt"

SESSION=`cat ./.cookie`
curl -b "session=$SESSION" https://adventofcode.com/$YEAR/day/$PUZZLE/input -o $DIR/__TESTS__/input.txt

open https://adventofcode.com/$YEAR/day/$PUZZLE
