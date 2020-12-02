YEAR=`date +'%Y'`

PUZZLES=(`ls $YEAR`)

PUZZLE=0
for i in "${PUZZLES[@]}"
do
	if [[ $i =~ ^puzzle ]]; then
   		PUZZLE=$((PUZZLE+1))
	fi
done

yarn test:all $YEAR/puzzle$PUZZLE $*