library(maptools)
library(doBy)
setwd("C:/Users/Ben/Dropbox/gdelt-egypt-turkey")
#setwd('/Users/cassydorff/Dropbox/gdelt-egypt-turkey/')
source("timeline.R")

icewsEGY <- read.csv("EgyptSyriaTurkey-2010forward/Egypt.csv",stringsAsFactors=F)
load("Daily_gdelt_egypt_counts.rda")

### ADD BINARY COLUMNS FOR ACTORS BASED ON GREP SEARCH
grepCol <- function(search, data, colname)
{
  binarysource <- grepl(search,data$Source.Sectors)
  binarytarget <- grepl(search,data$Target.Sectors)
  data[,paste(colname,"Source",sep=".")] <- binarysource
  data[,paste(colname,"Target",sep=".")] <- binarytarget
  print(mean(binarysource))
  print(mean(binarytarget))
  return(data)
}

### CHECK FREQUENCY OF INTERACTIONS BETWEEN GIVEN ACTOR TYPES
freqInteraction <- function(data,actorTypes)
{
  actorfreq <- matrix(NA,nrow=length(actorTypes),ncol=length(actorTypes))
  colnames(actorfreq) <- actorTypes
  rownames(actorfreq) <- actorTypes
  for(sourceactor in actorTypes)
  {
    for(targetactor in actorTypes)
    {
      subset <- cbind(data[,paste(sourceactor,".Source",sep="")],data[,paste(targetactor,".Target",sep="")])
      subset <- subset[subset[,1]==1,] 
      prop <- mean(subset[,2])
      actorfreq[sourceactor,targetactor] <- prop
    }
  }
  return(actorfreq)
}

### PROPORTION OF INTERACTIONS OF A GIVEN EVENT TYPE
eventProp <- function(data,sourceactor,targetactor)
{
  cond1 <- data[,paste(sourceactor,".Source",sep="")]==1
  cond2 <- data[,paste(targetactor,".Target",sep="")]==1
  subset <- data[cond1 & cond2,]
  return(sort(table(subset$EventType)/length(subset[,1])))
}

### DALIY COUNTS OF GIVEN EVENT
dailyCount<- function(data,actor,event,target=NULL)
{
  if(!is.null(target))
  {
    targetindicator <- rep(F,nrow(data))
    for(i in 1:length(target))
    {
      targetindicator <- targetindicator | (data[,target[i]] ==1)
    }
    data <- data[targetindicator,]
  }
  actorindicator <- rep(F,nrow(data))
  for(i in 1:length(actor))
  {
    actorindicator <- actorindicator | (data[,actor[i]] == 1)
  }
  eventindicator <- rep(F,length(actorindicator))
  for(i in 1:length(event))
  {
    eventindicator <- eventindicator | (grepl(event[i],data$EventType))
  }
  subset <- data$EventDate[actorindicator & eventindicator]
  resultTable <- table(subset)
  results <- data.frame(count=resultTable)
  names(results) <- c("date","count")
  results$date <- as.Date(results$date)
  return(results)
}

icewsEGY <- grepCol("Government",icewsEGY,"Gov")
icewsEGY <- grepCol("Protestor",icewsEGY,"Pro")
icewsEGY <- grepCol("Opposition",icewsEGY,"Opp")
icewsEGY <- grepCol("Military",icewsEGY,"Mil")
icewsEGY <- grepCol("Police",icewsEGY,"Pol")
icewsEGY <- grepCol("Religious",icewsEGY,"Rel")
icewsEGY <- grepCol("Rebel",icewsEGY,"Reb")
icewsEGY <- grepCol("Dissident",icewsEGY,"Dis")
icewsEGY <- grepCol("Media",icewsEGY,"Med")
icewsEGY <- grepCol("Elite",icewsEGY,"Eli")
icewsEGY <- grepCol("Finance",icewsEGY,"Fin")
icewsEGY <- grepCol("Civilian",icewsEGY,"Civ")


actorTypes <- c("Gov","Pro","Opp","Mil","Pol","Rel","Reb","Dis","Med","Eli","Fin","Civ")
freqInteraction(icewsEGY,actorTypes)


for(actor in c("Gov","Mil","Pol","Pro","Civ","Opp"))
{
  for(actor2 in c("Gov","Mil","Pol","Pro","Civ","Opp"))
    print(rev(eventProp(icewsEGY,actor,actor2))[1:3])
  readline("Press Enter")
}




### DEMO PLOT FOR MIKE
daily.gdelt.egypt$category <- "GDELT"
head(daily.gdelt.egypt)
oppprotest <- dailyCount(icewsEGY,c("Opp.Source","Pro.Source","Reb.Source","Civ.Source"),c("riot","rally","Protest"),c("Pol.Target","Gov.Target","Mil.Target"))
oppprotest$category <- "ICEWS"
combinedprotest <- data.frame(date=c(daily.gdelt.egypt$date,oppprotest$date),
                              count=c(daily.gdelt.egypt$antigov.protest,oppprotest$count),
                              category=c(daily.gdelt.egypt$category,oppprotest$category))

govrepression <- dailyCount(icewsEGY,c("Gov.Source","Mil.Source","Pol.Source"),c("repression","military force","small arms"),c("Pro.Target","Dis.Target","Reb.Target","Opp.Target"))
govrepression$category <- "ICEWS"
combinedrepression <- data.frame(date=c(daily.gdelt.egypt$date,govrepression$date),
                                 count=c(daily.gdelt.egypt$suppress.protestors,govrepression$count),
                                 category=c(daily.gdelt.egypt$category,govrepression$category))

labeldates1 <- c("2012-12-05","2013-06-17")
labels1 <- c("March on\npresidential palace","el-Khayat appt. governor")
labeldates2 <- c("2012-06-18","2012-12-15","2013-07-03")
labels2 <- c("Morsi wins","Constitutional\nreferendum","Morsi ousted")

pdf("plots/test.pdf",width=7,height=9)
par(mfrow=c(1,2),mar=c(5,5,5,1))
timeline(combinedprotest$date,combinedprotest$count,combinedprotest$category,c("#FF000077","#0000FF77"),labeldates=labeldates1,labels=labels1,ylab="",xlab="Protests & Rallies by\nOpposition, Rebels, & Civilians",dates=c("2012-06-01","2013-07-08"),xmax=50)
#legend("topright",fill=c("#FF000077","#0000FF77"),c("GDELT","ICEWS"),bty="n")
par(mar=c(5,1,5,5))
timeline(combinedrepression$date,combinedrepression$count,combinedrepression$category,c("#FF000077","#0000FF77"),labeldates=labeldates2,labels=labels2,ylab="",xlab="Repression of Opposition by\n Government Actors",dates=c("2012-06-01","2013-07-08"),xmax=50,flip=T)
par(new=T,mfrow=c(1,1),mar=c(5,5,5,5))
plot(1:10,1:10,type="n",frame=F,xaxt="n",yaxt="n",main="",xlab="",ylab="")
title(expression("GDELT" * phantom(" vs. ICEWS")),col.main="#FF000077")
title(expression(phantom("GDELT ") * "vs." * phantom(" ICEWS")),col.main="black")
title(expression(phantom("GDELT vs. ") * "ICEWS"),col.main="#0000FF77")
dev.off()


par(mfrow=c(1,2),mar=c(5,5,5,1.5))
timeline(daily.gdelt.egypt$date,daily.gdelt.egypt$antigov.protest,daily.gdelt.egypt$category,categorycolor=colors[1],labeldates=labeldates1,labels=labels1,ylab="",xlab="GDELT\nEgyptian Protests",dates=c("2012-06-01","2013-07-08"),xmax=50,flip=T)
#legend("topright",fill=c("#FF000077","#0000FF77"),c("GDELT","ICEWS"),bty="n")
par(mar=c(5,1.5,5,5))
timeline(oppprotest$date,oppprotest$count,oppprotest$category,labeldates=labeldates2,labels=labels2,categorycolor=colors[3],ylab="",xlab="ICEWS\nEgyptian Protests",dates=c("2012-06-01","2013-07-08"),yaxs=F,xmax=50)


# #### CREATE ICEWS PROTEST DATA ####
# eventTypes <- unique(icewsEGY$EventType)
# protestTypes <- eventTypes[grep("PROTEST",toupper(eventTypes))]
# icewsProtest <- icewsEGY[icewsEGY$EventType %in% protestTypes,]
# protestsPerDay <- table(icewsProtest$EventDate)
# names(protestsPerDay) <- as.Date(names(protestsPerDay))
# protestsPerDay <- protestsPerDay[order(names(protestsPerDay))]
# 
# #### PLOT DAILY COUNTS OF PROTESTS FROM ICEWS ####
# pdf("plots/icews-egypt-protest-count.pdf",width=7,height=7)
# xlims <- c(as.Date("2012-06-1"),as.Date(max(names(protestsPerDay))))
# plot(as.Date(names(protestsPerDay)),protestsPerDay,type="l",xlab="Date",ylab="Protest Events",xlim=xlims,main="Egypt Protests (ICEWS)",xaxt="n",las=1,frame=F)
# axis(1, at=seq(as.Date("2012-06-01"),xlims[2],by="month"), labels=c("Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"),cex.axis=.75)
# axis(1, at=as.Date("2013-01-01"), labels="2013",cex.axis=.75,tck=F,line=1)
# dev.off()
# 
# 
# data <- icewsEGY
# Source <- "Government"
# EventType <- "Protest"
# 
# 
# #### CREATE COMBINED PROTESTS DATA ####
# load("gdelt-egypt.RDA")
# head(egy)
# gdeltProtests <- egy[egy$event14==1,c("ActionGeo_Lat","ActionGeo_Long","date")]
# gdeltProtests$dataset <- "GDELT"
# names(gdeltProtests) <- c("Lat","Lon","Date","Dataset")
# fullProtests <- icewsProtest[,c("Latitude","Longitude","EventDate")]
# fullProtests$Dataset <- "ICEWS"
# names(fullProtests) <- c("Lat","Lon","Date","Dataset")
# fullProtests$Date <- as.Date(fullProtests$Date,format="%m/%d/%y")
# fullProtests <- rbind(fullProtests,gdeltProtests)
# write.csv(fullProtests,"combined_protests.csv",row.names=F)
# 
# #### PLOT AN EGYPT MAP ####
# EGYadm <- readShapePoly("Shapefiles/EGY_adm/EGY_adm1.shp")
# LBYadm <- readShapePoly("Shapefiles/LBY_adm/LBY_adm0.shp")
# SDNadm <- readShapePoly("Shapefiles/SDN_adm/SDN_adm0.shp")
# SAUadm <- readShapePoly("Shapefiles/SAU_adm/SAU_adm0.shp")
# ISRadm <- readShapePoly("Shapefiles/ISR_adm/ISR_adm0.shp")
# SYRadm <- readShapePoly("Shapefiles/SYR_adm/SYR_adm0.shp")
# PSEadm <- readShapePoly("Shapefiles/PSE_adm/PSE_adm0.shp")
# load("Shapefiles/JOR_adm0.RData")
# par(bg="lightgray")
# plot(EGYadm,col="white",border="black")
# plot(LBYadm,col="darkgray",border="black",add=T)
# plot(SDNadm,col="darkgray",border="black",add=T)
# plot(SAUadm,col="darkgray",border="black",add=T)
# plot(ISRadm,col="darkgray",border="black",add=T)
# plot(SYRadm,col="darkgray",border="black",add=T)
# plot(PSEadm,col="darkgray",border="black",add=T)
# plot(gadm,col="darkgray",border="black",add=T)
# points(icewsProtest$Longitude,icewsProtest$Latitude,col="red",pch=16)
