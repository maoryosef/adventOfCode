YEAR=${1:-$(date +%Y)}

PUZZLES=(`ls $YEAR`)

NEXT_PUZZLE=1
for i in "${PUZZLES[@]}"
do
	if [[ $i =~ ^puzzle ]]; then
   		NEXT_PUZZLE=$((NEXT_PUZZLE+1))
	fi
done

PUZZLE=${2:-$NEXT_PUZZLE}

DIR="./$YEAR/puzzle$PUZZLE"
mkdir -p $DIR/__TESTS__

cp ./template/puzzle.js "$DIR/puzzle$PUZZLE.js"
sed "s/<PNUM>/$PUZZLE/" ./template/puzzle.test.template.js > "$DIR/__TESTS__/puzzle$PUZZLE.test.js"

touch "$DIR/__TESTS__/input.test.1.txt"
touch "$DIR/__TESTS__/input.txt"

SESSION=`cat ./.cookie`
FILENAME="$DIR/__TESTS__/input.txt"
curl -b "session=$SESSION" https://adventofcode.com/$YEAR/day/$PUZZLE/input -o $FILENAME

truncate -s -1 "$FILENAME"

open https://adventofcode.com/$YEAR/day/$PUZZLE
