OUTFILE=egypt.tsv

cat CSV.header.dailyupdates.txt > $OUTFILE 

for f in *.csv
do
	echo $f 
	awk '{ if ($8=="EGY" || $18=="EGY" || $38=="EG" || $45=="EG") print }' $f >> $OUTFILE
done 

for f in *.CSV
do
	echo $f 
	awk '{ if ($8=="EGY" || $18=="EGY" || $38=="EG" || $45=="EG") print }' $f >> $OUTFILE
done 



