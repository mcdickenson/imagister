OUTFILE=syria.tsv

cat CSV.header.dailyupdates.txt > $OUTFILE 

for f in *.csv
do
	echo $f 
	awk '{ if ($8=="SYR" || $18=="SYR" || $38=="SY" || $45=="SY") print }' $f >> $OUTFILE
done 

for f in *.CSV
do
	echo $f 
	awk '{ if ($8=="SYR" || $18=="SYR" || $38=="SY" || $45=="SY") print }' $f >> $OUTFILE
done 