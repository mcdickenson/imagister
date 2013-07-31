# setwd("~/github/imagister/rcode")
source("icews-functions.R")
# source("toJSON.R")

icewsEGY <- read.csv("C:/users/ben/dropbox/gdelt-egypt-turkey/EgyptSyriaTurkey.zip Folder/Egypt-all.csv",stringsAsFactors=F)
# icewsEGY <- read.csv("~/dropbox/gdelt-egypt-turkey/EgyptSyriaTurkey.zip\ Folder/Egypt-all.csv",stringsAsFactors=F)

icewsEGY <- grepActor(c("Government","Military","Police"),"govt",icewsEGY)
icewsEGY <- grepActor(c("Protestor","Opposition","Dissident","Rebel"),"anti",icewsEGY)

icewsEGY <- grepAction(c("riot","rally","Protest"),"protest",icewsEGY)
icewsEGY <- grepAction(c("repression","military force","small arms"),"repress",icewsEGY)

newdata <- subsetICEWS("govt","repress","anti",icewsEGY,"Egypt","2011-01-01")
newdata <- rbind(newdata,subsetICEWS("anti","protest","govt",icewsEGY,"Egypt","2011-01-01"))

#write.csv(newdata,"../data/icews_egypt.csv",row.names=F)
icewsJSON(newdata,"../data/icews_egypt.json")
# toJSON(newdata, "../data/icews_egypt_2011on.json")

# icewsEGY <- grepCol("Government",icewsEGY,"Gov")
# icewsEGY <- grepCol("Protestor",icewsEGY,"Pro")
# icewsEGY <- grepCol("Opposition",icewsEGY,"Opp")
# icewsEGY <- grepCol("Military",icewsEGY,"Mil")
# icewsEGY <- grepCol("Police",icewsEGY,"Pol")
# icewsEGY <- grepCol("Religious",icewsEGY,"Rel")
# icewsEGY <- grepCol("Rebel",icewsEGY,"Reb")
# icewsEGY <- grepCol("Dissident",icewsEGY,"Dis")
# icewsEGY <- grepCol("Media",icewsEGY,"Med")
# icewsEGY <- grepCol("Elite",icewsEGY,"Eli")
# icewsEGY <- grepCol("Finance",icewsEGY,"Fin")
# icewsEGY <- grepCol("Civilian",icewsEGY,"Civ")