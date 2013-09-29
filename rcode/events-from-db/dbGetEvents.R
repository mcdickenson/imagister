# Get updated event data for imagister
# AB 
# September 2013
#
# dbGetEvents() function to pull events for a country over date range for 
#   given CAMEO codes from ICEWS or GDELT database.
#   Output df: source, country, date, latitude, longitude, cameo_code


formatList <- function(vector) {
  # Format a list for SQL
  res <- "("
  for (i in seq_along(vector)) {
    res <- paste0(res, "'", vector[i], "'")
    if (i < length(vector)) res <- paste0(res, ", ")
  }
  res <- paste0(res, ")")
  res
}

dbGetEvents <- function(data.source, country, start.date, end.date, cameo.codes, 
                        exe=F) 
  {
  if (!data.source %in% c("icews", "gdelt")) stop("data.source must be 'icews' or 'gdelt'")
  if (as.Date(start.date) >= as.Date(end.date)) stop("start date must be before end date")
  
  # End date for GDELT historical files
  gdelt.historical.end <- as.Date("2013-03-31")
    
  # Query for GDELT as source
  if (data.source=="gdelt") {
    
    # Get ISO country code
    sql <- paste0(
      "SELECT fipscode FROM countries WHERE countryname='",
      toupper(country),
      "';")
    fipscode <- dbGetQuery(conn, sql)
    
    # In db, gdelt is separated into two tables split by the date
    # 2013-03-31. Depending on where start and end date are, there are
    # three possible cases for what we need to query.
    if (start.date < gdelt.historical.end & end.date > gdelt.historical.end) {
      start1 <- as.numeric(gsub("-", "", as.character(start.date)))
      end1 <- as.numeric(gsub("-", "", as.character(gdelt.historical.end)))
      start2 <- as.numeric(gsub("-", "", as.character(gdelt.historical.end + 1)))
      end2 <- as.numeric(gsub("-", "", as.character(end.date)))
    } else {  
      # If date range does not overlap table cutoff, then only one of the 
      # queries below will run, so we don't have to worry about assigned same 
      # dates to both.
      start1 <- as.numeric(gsub("-", "", as.character(start.date)))
      end1 <- as.numeric(gsub("-", "", as.character(end.date)))
      start2 <- as.numeric(gsub("-", "", as.character(start.date)))
      end2 <- as.numeric(gsub("-", "", as.character(end.date)))
    }
    
    # Initiate results so we can combine them later on even if ran only one SQL
    res1 <- res2 <- NULL
    
    # Start queries
    if (start.date < gdelt.historical.end) {
      # Only query historical table
      dbSendQuery(conn, "DROP TABLE IF EXISTS temp_results;")
      sql <- paste0(
        "CREATE TABLE temp_results AS \n",
        "SELECT 'gdelt' AS source, '", country, "' AS country, \n",
        "    sqldate AS date, eventcode AS cameo_code, \n",
        "    actiongeo_lat AS latitude, actiongeo_long AS longitude \n",
        "FROM gdelt_historical \n",
        "WHERE actiongeo_countrycode = '", fipscode, "'\n",
        "AND sqldate BETWEEN '", start1, "' AND '", end1, "'\n",
        "AND eventcode IN ", formatList(cameo.codes),
        ";")
      if (!exe) {
        cat("Query for GDELT historical: \n\n")
        cat(sql, "\n\n")
      } else {
        dbSendQuery(conn, sql)
        res1 <- dbGetQuery(conn, "SELECT * FROM temp_results;")
      }
    } 
    if (end.date > gdelt.historical.end) {
      # Only query daily updates table
      dbSendQuery(conn, "DROP TABLE IF EXISTS temp_results;")
      sql <- paste0(
        "CREATE TABLE temp_results AS \n",
        "SELECT 'gdelt' AS source, '", country, "' AS country, \n",
        "    sqldate AS date, eventcode AS cameo_code, \n",
        "    actiongeo_lat AS latitude, actiongeo_long AS longitude \n",
        "FROM gdelt_dailyupdates \n",
        "WHERE actiongeo_countrycode = '", fipscode, "'\n",
        "AND sqldate BETWEEN '", start2, "' AND '", end2, "'\n",
        "AND eventcode IN ", formatList(cameo.codes), ";")
      if (!exe) {
        cat("Query for GDELT daily updates: \n\n")
        cat(sql, "\n\n")
      } else {
        dbSendQuery(conn, sql)
        res2 <- dbGetQuery(conn, "SELECT * FROM temp_results;")
      }
    } 
    # Combine results
    res <- rbind(res1, res2)  # if we did only one query, one of these will be
                              # NULL, which does not affect rbind()
    if (!is.null(res)) {
      res$date <- as.Date(as.character(res$date), format="%Y%m%d")
      dbSendQuery(conn, "DROP TABLE temp_results;")
    }
  }
  
  # Query for ICEWS as data source
  if (data.source=="icews") {
    # Get country ID
    # In future add something to check whether country is in CountryName
    sql <- paste0(
      "SELECT id AS country_id FROM countries WHERE CountryName='",
      toupper(country), 
      "';")
    country_id <- dbGetQuery(conn, sql)
    
    # Get ICEWS event codes
    sql <- paste0(
      "SELECT eventtype_ID FROM eventtypes \n",
      "WHERE code IN ", formatList(cameo.codes), ";"
    )
    icews.codes <- dbGetQuery(conn, sql)$eventtype_ID
    
    # Subset events by date and country
    dbSendQuery(conn, "DROP TABLE IF EXISTS temp_results;")
    sql <- paste0(
      "CREATE TABLE temp_results AS \n",
      "SELECT 'icews' AS source, '", country, "' AS country, \n",
      "    event_date AS date, eventtype_ID, location_ID \n",
      "FROM events \n",
      "WHERE location_id IN \n",
      "(SELECT location_id FROM locations WHERE country_id = ", country_id, ")\n",
      "AND event_date BETWEEN '", start.date, "' AND '", end.date, "'\n",
      "AND eventtype_ID IN ", formatList(icews.codes), "\n",
      ";")
    dbSendQuery(conn, sql)
    # Add cameo codes
    dbSendQuery(conn, "ALTER TABLE temp_results ADD COLUMN cameo_code varchar(6);")
    dbSendQuery(conn, paste0(
      "UPDATE temp_results JOIN eventtypes \n",
      "SET temp_results.cameo_code = eventtypes.code \n",
      "WHERE (temp_results.eventtype_ID = eventtypes.eventtype_ID);"))
    # Add latitude
    dbSendQuery(conn, "ALTER TABLE temp_results ADD COLUMN latitude float;")
    dbSendQuery(conn, paste0(
      "UPDATE temp_results JOIN locations \n",
      "SET temp_results.latitude = locations.Latitude \n",
      "WHERE (temp_results.location_ID = locations.location_ID);"))
    # Add longitude
    dbSendQuery(conn, "ALTER TABLE temp_results ADD COLUMN longitude float;")
    dbSendQuery(conn, paste0(
      "UPDATE temp_results JOIN locations \n",
      "SET temp_results.longitude = locations.Longitude \n",
      "WHERE (temp_results.location_ID = locations.location_ID);"))
    # Drop eventtype and location keys
    dbSendQuery(conn, "ALTER TABLE temp_results 
                DROP COLUMN eventtype_ID,
                DROP COLUMN location_ID;")
    res <- dbGetQuery(conn, "SELECT * FROM temp_results;")
    res$date <- as.Date(res$date)
    dbSendQuery(conn, "DROP TABLE temp_results;")
  }
  return(res)
}

# Test it
#codes <- c(141, 1411, 1412, 1413, 1414)
#test1 <- dbGetEvents("icews", "Egypt", "2013-06-01", "2013-06-03", codes)
#test2 <- dbGetEvents("gdelt", "Egypt", "2011-06-01", "2011-06-03", codes)
#test3 <- dbGetEvents("gdelt", "Egypt", "2013-06-01", "2013-06-03", codes)
#test4 <- dbGetEvents("gdelt", "Egypt", "2013-03-30", "2013-04-02", codes)


# Write csv ---------------------------------------------------------------


prot.codes <- c(141, 1411, 1412, 1413, 1414, 
                145, 1451, 1452, 1453, 1454)
conf.codes <- c(19, 190, 191, 192, 193, 194, 195, 196,
                20, 200, 201, 202, 203, 204, 2041)

# Egypt
t1 <- dbGetEvents("icews", "Egypt", "2011-01-01", "2013-09-03", prot.codes)
t2 <- dbGetEvents("gdelt", "Egypt", "2011-01-01", "2013-09-03", prot.codes)

# CREATE TABLE egypt2 AS 
# SELECT 'gdelt' AS source, 'Egypt' AS country, 
# sqldate AS date, eventcode AS cameo_code, 
# actiongeo_lat AS latitude, actiongeo_long AS longitude 
# FROM gdelt_historical 
# WHERE actiongeo_countrycode = 'EG'
# AND sqldate BETWEEN '20110101' AND '20130331'
# AND eventcode IN ('141', '1411', '1412', '1413', '1414', '145', '1451', '1452', '1453', '1454'); 
#t2a.eg <- dbGetQuery(conn, "SELECT * FROM egypt2;")

# CREATE TABLE egypt AS 
# SELECT 'gdelt' AS source, 'Egypt' AS country, 
# sqldate AS date, eventcode AS cameo_code, 
# actiongeo_lat AS latitude, actiongeo_long AS longitude 
# FROM gdelt_dailyupdates 
# WHERE actiongeo_countrycode = 'EG'
# AND sqldate BETWEEN '20130401' AND '20130903'
# AND eventcode IN ('141', '1411', '1412', '1413', '1414', '145', '1451', '1452', '1453', '1454')
#t2b.eg <- dbGetQuery(conn, "SELECT * FROM egypt;")

#t2 <- rbind(t2a.eg, t2b.eg)
#t2$date <- as.Date(as.character(t2$date), format="%Y%m%d")
#temp <- subset(t2, t2$date >= as.Date("2012-11-01") & t2$date <= as.Date("2012-11-30"))
#daily <- as.matrix(unlist(by(temp, temp$date, nrow)))
egypt <- rbind(t1.eg, t2)#; rm(t1, t2)
write.csv(egypt, file="egypt.csv", row.names=F)

# Syria
t1 <- dbGetEvents("icews", "Syrian Arab Republic", "2011-01-01", "2013-09-03", conf.codes)
t2 <- dbGetEvents("gdelt", "Syria", "2011-01-01", "2013-09-03", conf.codes)
# t2a.sy <- dbGetQuery(conn, "SELECT * FROM syria2;")
# t2b.sy <- dbGetQuery(conn, "SELECT * FROM syria;")
#t2 <- rbind(t2a.sy, t2b.sy)
#t2$date <- as.Date(as.character(t2$date), format="%Y%m%d")
syria <- rbind(t1.sy, t2)#; rm(t1, t2)
write.csv(syria, file="syria.csv", row.names=F)

# Turkey
t1 <- dbGetEvents("icews", "Turkey", "2011-01-01", "2013-09-03", prot.codes)
t2 <- dbGetEvents("gdelt", "Turkey", "2011-01-01", "2013-09-03", prot.codes)

# CREATE TABLE turkey2 AS 
# SELECT 'gdelt' AS source, 'Turkey' AS country, 
# sqldate AS date, eventcode AS cameo_code, 
# actiongeo_lat AS latitude, actiongeo_long AS longitude 
# FROM gdelt_historical 
# WHERE actiongeo_countrycode = 'TU'
# AND sqldate BETWEEN '20110101' AND '20130331'
# AND eventcode IN ('141', '1411', '1412', '1413', '1414', '145', '1451', '1452', '1453', '1454'); 
# t2a.tr <- dbGetQuery(conn, "SELECT * FROM turkey2;")

# CREATE TABLE turkey AS 
# SELECT 'gdelt' AS source, 'Turkey' AS country, 
# sqldate AS date, eventcode AS cameo_code, 
# actiongeo_lat AS latitude, actiongeo_long AS longitude 
# FROM gdelt_dailyupdates 
# WHERE actiongeo_countrycode = 'TU'
# AND sqldate BETWEEN '20130401' AND '20130903'
# AND eventcode IN ('141', '1411', '1412', '1413', '1414', '145', '1451', '1452', '1453', '1454')
# t2b.tr <- dbGetQuery(conn, "SELECT * FROM turkey;")

# t2 <- rbind(t2a.tr, t2b.tr)
#t2$date <- as.Date(as.character(t2$date), format="%Y%m%d")
turkey <- rbind(t1.tr, t2)#; rm(t1, t2)
write.csv(turkey, file="turkey.csv", row.names=F)

# All
all <- rbind(egypt, syria, turkey)
write.csv(all, file="all.csv", row.names=F)


# End, close connection ---------------------------------------------------


dbDisconnect(conn)
