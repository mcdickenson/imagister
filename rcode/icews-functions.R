require("RJSONIO")

### ADD ACTORS TO ACTOR COLUMNS BASED ON GREP SEARCH
grepActor <- function(search, actorname, data)
{
  if(!exists("SenderActor",data))
    data$SenderActor <- NA
  if(!exists("ReceiverActor",data))
    data$ReceiverActor <- NA
  binarysender <- rep(F,nrow(data))
  binaryreceiver <- binarysender
  for(i in search)
  {
    binarysender <- binarysender | grepl(i,data$Source.Sectors)
    binaryreceiver <- binaryreceiver | grepl(i,data$Target.Sectors)
  }
  data$SenderActor[binarysender] <- actorname
  data$ReceiverActor[binaryreceiver] <- actorname
  cat(paste(mean(binarysender)," - ",mean(binaryreceiver),"\n",sep=""))
  return(data)
}

### ADD EVENTS TO ACTION COLUMN BASED ON GREP SEARCH
grepAction <- function(search, actionname, data)
{
  if(!exists("Action",data))
    data$Action <- NA
  binaryaction <- rep(F,nrow(data))
  for(i in search)
  {
    binaryaction <- binaryaction | grepl(toupper(i),toupper(data$EventType))
  }
  data$Action[binaryaction] <- actionname
  cat(mean(binaryaction),"\n")
  return(data)
}

### RETURN DESIRED ACTOR EVENT COMBINATIONS
subsetICEWS <- function(sender,action,receiver,data,country,startdate=NULL)
{
  if(is.null(startdate))
    startdate <- min(data$EventDate)
  newdata <- data[(data$SenderActor==sender & data$Action==action & data$ReceiverActor==receiver),c("SenderActor","Action","ReceiverActor","EventDate","Latitude","Longitude")]
  names(newdata) <- c("SenderActor","Action","ReceiverActor","Date","Latitude","Longitude")
  newdata <- newdata[complete.cases(newdata),]
  newdata <- newdata[as.Date(newdata$Date)>=as.Date(startdate),]
  newdata$Country <- country
  newdata$Source <- "ICEWS"
  return(newdata)
}

### CONVERT ICEWS TO JSON FORMAT
icewsJSON <- function(data,filename)
{
  string <- ""
  for(row in 1:nrow(data))
  {
    string <- paste(string,"{\n",sep="")
    for(col in 1:ncol(data))
    {
      colname <- colnames(data)[col]
      colval <- data[row,col]
      #ifelse(is.na(as.numeric(colval)),colval <- colval,colval <- as.numeric(colval))
      #if(!is.numeric(colval))
        colval <- paste('\"',colval,'\"',sep="")
      ifelse(col == ncol(data),endline <- "\n",endline <- ",\n")
      string <- paste(string,'"',colname,'\": ',colval,endline,sep="")
    }
    string <- paste(string,"},\n",sep="")
  }
  sink(file=filename)
  cat("[\n")
  cat(substr(string,1,nchar(string)-2))
  cat("\n]")
  sink()
}
