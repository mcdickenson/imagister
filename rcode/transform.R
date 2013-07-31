#!/usr/bin/R

# usage: after running country-subset.sh
pathSubsets = "/Volumes/externalhd/gdelt-subsets"
pathScripts = "/Volumes/externalhd/gdelt-scripts"
setwd(pathScripts)
source("toJSON.R")

# load data
setwd(pathSubsets)
egy = read.delim('egypt.tsv', as.is=TRUE)
syr = read.delim('syria.tsv', as.is=TRUE)
tur = read.delim('turkey.tsv', as.is=TRUE)
combo = rbind(egy, syr, tur)
# combo = egy 
dim(combo)

#######
# set variables of interest
# SenderActor and ReceiverActor
govt.actor.types = c("COP", "GOV", "MIL")
anti.actor.types = c("OPP", "REB", "CVL")
combo$govt.sender = ifelse((combo$Actor1Type1Code %in% govt.actor.types) | (combo$Actor1Type2Code %in% govt.actor.types) | (combo$Actor1Type3Code %in% govt.actor.types), TRUE, FALSE)
combo$anti.sender = ifelse((combo$Actor1Type1Code %in% anti.actor.types) | (combo$Actor1Type2Code %in% anti.actor.types) | (combo$Actor1Type3Code %in% anti.actor.types), TRUE, FALSE)
combo$govt.receiver = ifelse((combo$Actor2Type1Code %in% govt.actor.types) | (combo$Actor2Type2Code %in% govt.actor.types) | (combo$Actor2Type3Code %in% govt.actor.types), TRUE, FALSE)
combo$anti.receiver = ifelse((combo$Actor2Type1Code %in% anti.actor.types) | (combo$Actor2Type2Code %in% anti.actor.types) | (combo$Actor2Type3Code %in% anti.actor.types), TRUE, FALSE)
length(which(combo$govt.sender & combo$anti.sender)) # 0 

combo$SenderActor = NA 
combo$ReceiverActor = NA 
combo$SenderActor = ifelse(combo$govt.sender, "govt", combo$SenderActor)
combo$SenderActor = ifelse(combo$anti.sender, "anti", combo$SenderActor)
combo$ReceiverActor = ifelse(combo$govt.receiver, "govt", combo$ReceiverActor)
combo$ReceiverActor = ifelse(combo$anti.receiver, "anti", combo$ReceiverActor)

# Action
combo$Action = NA 
combo$Action = ifelse((combo$EventBaseCode==145) | (combo$EventBaseCode==141), "protest", combo$Action)
combo$Action = ifelse(combo$EventBaseCode==175, "repress", combo$Action)
combo$Action = ifelse(combo$EventRootCode==19, "fight", combo$Action)

# Date 
combo$Date = as.Date(as.character(combo$SQLDATE), format="%Y%m%d")
min(combo$Date)
max(combo$Date)

# Lat/Long
combo$Latitude = combo$ActionGeo_Lat
combo$Longitude = combo$ActionGeo_Long

# country and source 
combo$Country = NA 
combo$Country = ifelse(combo$Actor1Geo_CountryCode=="EG", "Egypt", combo$Country)
# combo$Country = "Egypt"
combo$Country = ifelse(combo$Actor1Geo_CountryCode=="SY", "Syria", combo$Country)
combo$Country = ifelse(combo$Actor1Geo_CountryCode=="TU", "Turkey", combo$Country)
combo$Source = "gdelt"

#######
# subset to data wanted (rows, then cols)
wantcols = c("SenderActor", "Action", "ReceiverActor", "Date", "Latitude", "Longitude", "Country", "Source")
subset = combo[, wantcols]
subset = subset[complete.cases(subset), ]

notwant = which((subset$Country=="Egypt" & subset$Action=="fight") | (subset$Country=="Turkey" & subset$Action=="fight"))
length(notwant)
subset = subset[-notwant, ]

notwant = which(subset$Country=="Syria" & subset$Action!="fight")
length(notwant)
subset = subset[-notwant, ]

notwant = which(subset$SenderActor==subset$ReceiverActor)
length(notwant)
subset = subset[-notwant, ]

notwant = which(subset$SenderActor=="govt" & subset$Action=="protest")
length(notwant)
subset = subset[-notwant, ]

notwant = which(subset$SenderActor=="anti" & subset$Action=="repress")
length(notwant)
subset = subset[-notwant, ]

subset = subset[order(subset$Country, subset$Date, subset$SenderActor), ]

# egy = subset 
# want = which(egy$Date >= as.Date("2011-01-01"))
# length(want)
# egy = egy[want, ]
# min(egy$Date)
# max(egy$Date)

dim(subset) # 3,535
min(subset$Date) # 2001-01-13
max(subset$Date) # 2013-07-25
head(subset)
tail(subset)

#######
# save output (csv and json) 
write.csv(subset, file="gdelt-egy-syr-tur-subset-20130725.csv", row.names=FALSE)

toJSON(subset, filename="gdelt20130725.json")

# setwd("~/github/imagister/data")
# toJSON(egy, filename="gdelt-egypt-2011on.json")
