setwd("~/github/imagister/rcode")
source("icews-functions.R")

# icewsTUR <- read.csv("C:/users/ben/dropbox/gdelt-egypt-turkey/EgyptSyriaTurkey-2010forward/Turkey.csv",stringsAsFactors=F)
setwd('~/dropbox/gdelt-egypt-turkey/EgyptSyriaTurkey-2010forward')
icewsTUR <- read.csv("Turkey.csv",stringsAsFactors=F)
dim(icewsTUR)

icewsTUR <- grepActor(c("Government","Military","Police"),"govt",icewsTUR)
icewsTUR <- grepActor(c("Protestor","Opposition","Dissident","Rebel"),"anti",icewsTUR)

icewsTUR <- grepAction(c("riot","rally","Protest"),"protest",icewsTUR)
icewsTUR <- grepAction(c("repression","military force","small arms"),"repress",icewsTUR)

newdata <- subsetICEWS("govt","repress","anti",icewsTUR,"Turkey","2011-01-01")
newdata <- rbind(newdata,subsetICEWS("anti","protest","govt",icewsTUR,"Turkey","2011-01-01"))

#write.csv(newdata,"../data/icews_turkey.csv",row.names=F)
# icewsJSON(newdata,"../data/icews_turkey.json")

setwd("~/github/imagister/rcode")
write.csv(newdata,"../data/icews-turkey-2011on.csv",row.names=F)
