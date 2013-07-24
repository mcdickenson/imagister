#!/usr/bin/R

# Note: this command is currently only implemented 
# 			for protest events, with Egypt in mind

# example below
transform = function(icews, gdelt, outfile, mindate=NA, maxdate=NA){
	
	# process gdelt data
	gdelt$riot = ifelse(gdelt$EventBaseCode==145, 1, 0)
	gdelt$demo = ifelse(gdelt$EventBaseCode==141, 1, 0)
	gdelt$repr = ifelse(gdelt$EventBaseCode==175, 1, 0)
	gdelt$mifo = ifelse(gdelt$EventBaseCode==190, 1, 0)
	gdelt$secforce = ifelse(gdelt$type1cop==1 | gdelt$type1gov==1 | gdelt$type1mil==1, 1, 0)
	gdelt$secforce2 = ifelse(gdelt$type2cop==1 | gdelt$type2gov==1 | gdelt$type2mil==1, 1, 0)
	gdelt$antigov = ifelse(gdelt$type1opp==1 | gdelt$type1reb==1 | gdelt$type1cvl==1, 1, 0)
	gdelt$antigov2 = ifelse(gdelt$type2opp==1 | gdelt$type2reb==1 | gdelt$type2cvl==1, 1, 0)
	gdelt$secforce.repr = gdelt$secforce * gdelt$repr
	gdelt$secforce.mifo = gdelt$secforce * gdelt$mifo 
	gdelt$secforce.suppress = ifelse(gdelt$secforce.repr > 0 | gdelt$secforce.repr > 0, 1, 0)
	gdelt$antigov.riot = gdelt$antigov * gdelt$riot
	gdelt$antigov.demo = gdelt$antigov * gdelt$demo 
	gdelt$antigov.protest = ifelse(gdelt$antigov.riot > 0 | gdelt$antigov.demo > 0, 1, 0)
	gdelt$secforce.suppress.protestors = ifelse(gdelt$secforce.suppress==1 & gdelt$antigov2==1, 1, 0)
	gdelt$antigov.protest.secforce = ifelse(gdelt$antigov.protest==1 & gdelt$secforce2==1, 1, 0)
	gdelt$secforce.suppress.protestors = ifelse(gdelt$secforce.suppress==1 & gdelt$antigov2==1, 1, 0)
	gdelt$antigov.protest.secforce = ifelse(gdelt$antigov.protest==1 & gdelt$secforce2==1, 1, 0)
	
	# subset gdelt data 
	example = gdelt[which(gdelt$secforce.suppress.protestors==1 | gdelt$antigov.protest.secforce==1), ]
	example$SenderActor = ifelse(example$secforce.suppress.protestors==1, "govt", "anti")
	example$Action = ifelse(example$secforce.suppress.protestors==1, "repress", "protest") 
	example$ReceiverActor = ifelse(example$secforce.suppress.protestors==1, "anti", "govt")
	example$Date = example$date 
	example$Latitude = example$ActionGeo_Lat
	example$Longitude = example$ActionGeo_Long
	example$Country = "Egypt"
	example$Source = "gdelt"
	wantcols = c("SenderActor", "Action", "ReceiverActor", "Date", "Latitude", "Longitude", "Country", "Source")
	example = example[, wantcols]

	# process icews data 
	icews = grepCol("Government",icews,"Gov")
	icews = grepCol("Protestor",icews,"Pro")
	icews = grepCol("Opposition",icews,"Opp")
	icews = grepCol("Military",icews,"Mil")
	icews = grepCol("Police",icews,"Pol")
	icews = grepCol("Religious",icews,"Rel")
	icews = grepCol("Rebel",icews,"Reb")
	icews = grepCol("Dissident",icews,"Dis")
	icews = grepCol("Media",icews,"Med")
	icews = grepCol("Elite",icews,"Eli")
	icews = grepCol("Finance",icews,"Fin")
	icews = grepCol("Civilian",icews,"Civ")
	eventTypes = unique(icews$EventType)
	protestTypes = eventTypes[grep("PROTEST",toupper(eventTypes))]
	icews$protest = icews$EventType %in% protestTypes
	repressTypes = eventTypes[c(grep("REPRESSION", toupper(eventTypes)), grep("MILITARY FORCE", toupper(eventTypes)), grep("SMALL ARMS", toupper(eventTypes)))]
	icews$repress = icews$EventType %in% repressTypes

	# subset icews data
	subset = icews[icews$protest | icews$repress, ]
	subset$gov.sender = ifelse(subset$Gov.Source | subset$Mil.Source | subset$Pol.Source, TRUE, FALSE)
	subset$gov.receiver = ifelse(subset$Gov.Target | subset$Mil.Target | subset$Pol.Target, TRUE, FALSE)
	subset$anti.sender = ifelse(subset$Pro.Source | subset$Opp.Source | subset$Reb.Source | subset$Dis.Source, TRUE, FALSE)
	subset$anti.receiver = ifelse(subset$Pro.Target | subset$Opp.Target | subset$Reb.Target | subset$Dis.Target, TRUE, FALSE)
	want = (subset$gov.sender & subset$anti.receiver) | (subset$gov.receiver & subset$anti.sender)
	subset = subset[want, ]
	subset$SenderActor = ifelse(subset$gov.sender, "govt", "anti")
	subset$Action = ifelse(subset$repress, "repress", "protest") 
	subset$ReceiverActor = ifelse(subset$anti.receiver, "anti", "govt")
	subset$Date = subset$EventDate
	subset$Country = "Egypt"
	subset$Source = "icews"
	subset = subset[, wantcols]

	# combine icews and gdelt
	combo = rbind(example, subset)
	combo = combo[order(combo$Date, combo$SenderActor, combo$Source), ]
	if(!is.na(mindate)){
		combo = combo[combo$Date >= as.Date(mindate), ]
	}
	if(!is.na(maxdate)){
		combo = combo[combo$Date <= as.Date(maxdate), ]
	}

	# output combined data
	combo$Date = as.character(combo$Date)
	write.csv(combo, file=outfile, row.names=FALSE)

}


grepCol = function(search, data, colname)
{
  binarysource = grepl(search,data$Source.Sectors)
  binarytarget = grepl(search,data$Target.Sectors)
  data[,paste(colname,"Source",sep=".")] = binarysource
  data[,paste(colname,"Target",sep=".")] = binarytarget
  return(data)
}


pathData = "~/dropbox/gdelt-egypt-turkey"
setwd(pathData)
icews = read.csv("EgyptSyriaTurkey-2010forward/Egypt.csv",stringsAsFactors=F)
dim(icews)
load('gdelt-egypt.rda')
gdelt=egy
rm(egy)
dim(gdelt) 
transform(icews, gdelt, "testfile.csv", mindate="2012-06-01")




