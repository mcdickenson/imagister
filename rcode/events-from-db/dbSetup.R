# Setup connection to event database.
# AB
# September 2013

dbSetup <- function() {
  if (Sys.info()["user"]=="ab428") {
    db.user <- "ab428"
    db.pw <- ""
  }
  if (db.pw=="") stop("Fill in database password")
  
  # Try MySQL
  library(RMySQL)
  tryCatch(conn <<- dbConnect(MySQL(), user=db.user, password=db.pw, 
                              dbname="event_data", host="152.3.32.10"), 
           error=function(e) warning("MySQL connection does not work"))
}
dbSetup()