require(geonames)

getCountry <- function(lat,lon,radius=10)
{
  country <- rep(NA,length(lat))
  options(warn=-1)
  for(i in 1:length(lat))
  {
    templat <- lat[i]
    templon <- lon[i]
    result <- GNcountryCode(templat,templon,radius=radius)
    try(country[i] <- result$countryCode,silent=T)
  }
  options(warn=0)
  return(country)
}

matchLatLon <- function(tolat,tolon,fromlat,fromlon,country)
{
  tocountry <- rep(NA,length(tolat))
  for(i in 1:length(fromlat))
  {
    tocountry[tolat==fromlat[i] & tolon==fromlon[i]] <- country[i]
  }
  return(tocountry)
}

findCountries <- function(lat,lon,radius=10)
{
  lats <- lat[!duplicated(paste(bothdata$Latitude,bothdata$Longitude))]
  lons <- lon[!duplicated(paste(bothdata$Latitude,bothdata$Longitude))]
  results <- getCountry(lats,lons)
  countrylist <- matchLatLon(lat,lon,lats,lons,results)
  return(countrylist)
}

cat("This will return the 2-character country code for a vector of latitude and longitude values.\n")
cat("The rate-limit for this code is 2000 latitude-longitude pairs per hour.\n")
cat("Use:\t findCountries(lat,lon,radius)\n")
cat("\t\t\t\t\t lat: Vector of latitude values\n")
cat("\t\t\t\t\t lon: Vector of longitude values\n")
cat("\t\t\t\t\t radius: Radius (in km) for associating points in the sea with a nearby country")
