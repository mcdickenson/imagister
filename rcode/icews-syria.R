source("icews-functions.R")

icewsSYR <- read.csv("C:/users/ben/dropbox/gdelt-egypt-turkey/EgyptSyriaTurkey-2010forward/Syria.csv",stringsAsFactors=F)

icewsSYR <- grepActor(c("Government","Military","Police"),"govt",icewsSYR)
icewsSYR <- grepActor(c("Protestor","Opposition","Dissident","Rebel"),"anti",icewsSYR)

icewsSYR <- grepAction(c("military force","blockade","Occupy territory","small arms and light weapons","artillery and tanks","aerial weapons","ceasefire" , "unconventional violence", "riot"),"fight",icewsSYR)

newdata <- subsetICEWS("govt","fight","anti",icewsSYR,"Syria","2012-06-01")
newdata <- rbind(newdata,subsetICEWS("anti","fight","govt",icewsSYR,"Syria","2012-06-01"))

#write.csv(newdata,"../data/icews_syria.csv",row.names=F)
icewsJSON(newdata,"../data/icews_syria.json")