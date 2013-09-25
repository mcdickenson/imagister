# dbGetEvents() function to pull events for a country over date range for 
#   given CAMEO codes from ICEWS or GDELT database.
#   Output df: source, country, date, latitude, longitude, cameo_code
# AB
# September 2013

source(dbSetup.R)

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

dbGetEvents <- function(data.source, country, start.date, end.date, cameo.codes) 
  {
  if (!data.source %in% c("icews", "gdelt")) stop("data.source must be 'icews' or 'gdelt'")
  
  # for ICEWS for now
  
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
      "LIMIT 20;")
    dbSendQuery(conn, sql)
    # Add location and cameo codes
    dbSendQuery(conn, "ALTER TABLE temp_results ADD COLUMN latitude float;")
    dbSendQuery(conn, paste0(
      "UPDATE temp_results JOIN locations \n",
      "SET temp_results.latitude = locations.Latitude \n",
      "WHERE (temp_results.location_ID = locations.location_ID);"))
    dbSendQuery(conn, "ALTER TABLE temp_results ADD COLUMN longitude float;")
    dbSendQuery(conn, paste0(
      "UPDATE temp_results JOIN locations \n",
      "SET temp_results.longitude = locations.Longitude \n",
      "WHERE (temp_results.location_ID = locations.location_ID);"))
    dbSendQuery(conn, "ALTER TABLE temp_results ADD COLUMN cameo_code varchar(6);")
    dbSendQuery(conn, paste0(
      "UPDATE temp_results JOIN eventtypes \n",
      "SET temp_results.cameo_code = eventtypes.code \n",
      "WHERE (temp_results.eventtype_ID = eventtypes.eventtype_ID);"))
    dbSendQuery(conn, "ALTER TABLE temp_results 
                DROP COLUMN eventtype_ID,
                DROP COLUMN location_ID;")
    res <- dbGetQuery(conn, "SELECT * FROM temp_results;")
    dbSendQuery(conn, "DROP TABLE temp_results;")
  }
  return(res)
}

# Test it
codes <- c(141, 1411, 1412, 1413, 1414)
test <- dbGetEvents("icews", "Egypt", "2011-01-01", "2011-01-03", codes)


# End, close connection ---------------------------------------------------


dbDisconnect(conn)