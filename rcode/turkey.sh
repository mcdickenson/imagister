OUTFILE=turkey.tsv

cat CSV.header.dailyupdates.txt > $OUTFILE 

for f in *.csv
do
	echo $f 
	awk '{ if ($8=="TUR" || $18=="TUR" || $38=="TU" || $45=="TU") print }' $f >> $OUTFILE
done 

for f in *.CSV
do
	echo $f 
	awk '{ if ($8=="TUR" || $18=="TUR" || $38=="TU" || $45=="TU") print }' $f >> $OUTFILE
done 



