toJSON = function(data,filename=""){
	json="[\n"
	for(row_ix in 1:nrow(data)){
		row = data[row_ix, ]
		rowjson = "\t{\n" 
		for(cname in colnames(data)){
			rowjson = paste(rowjson, "\t\t", '\"', cname, '\": \"', row[,cname], '\"', sep="")
			if(cname!=colnames(data)[ncol(data)]){
				rowjson = paste(rowjson, ",", sep="")
			}
			rowjson = paste(rowjson, "\n", sep="")
		}
		rowjson = paste(rowjson, "\t}", sep="")
		if(row_ix < nrow(data)){
			rowjson = paste(rowjson, ",", sep="")
		}
		json = paste(json, rowjson, "\n", sep="")
	}
	json = paste(json, "]", sep="")
	cat(json, file=filename)
}