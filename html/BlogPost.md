# Catchy Title Here

## GDELT and ICEWS

Conflict occurs around the world at an astonishing pace; it is geographically dispersed and complex in its various manifestations. Whether it is at the level of mass protests, such as the on-going events in Turkey, or at the local level as represented by current events in Mexico where civilian neighborhood groups clash with armed actors, conflict is a global and rapidly evolving phenomenon. 

It is no surprise that social scientists and policy analysts strive to invent creative ways of capturing detailed, continuously updated data on these events in order to improve upon the ability to predict where and when conflict will happen. Both the [Integrated Crises Early Warning System (ICEWS)](http://www.mbr-pwrc.usgs.gov/jeh/ImperfectDetection/Refs/OBrien%20et%20al%20data%20paper.pdf) project and the [Global Database of Events, Language, and Tone (GDELT)](http://gdelt.utdallas.edu) project endeavor to provide such data.  

The ICEWS data are collected from natural language processing of a continuously updated harvest of news stories, primarily taken from FactivaTM, an open source, proprietary repository of news stories from over 200 sources around the world. ICEWS utilizes news articles from over 75 electronic regional and international news sources and machine coded these events, using the Penn State Event Data Project's TABARI (Text Analysis By Augmented Replacement Instructions) software program [(Schrodt 2009)](http://qipsr.as.uky.edu/sites/default/files/Schrodt.EventData.Princeton2011.pdf) and a commercially developed java variant (JABARI). TABARI and JABARI use sparse parsing and pattern recognition techniques to machine code daily political events based primarily on a categorical coding scheme developed by the Conflict and Mediation Event Observation (CAMEO) project [(Schrodt and Yilmaz 2007)](http://eventdata.psu.edu/cameo.dir/CAMEO.CDB.09b5.pdf). The origins and scope of this project is described in detail in [O'Brien (2010)](http://www.mbr-pwrc.usgs.gov/jeh/ImperfectDetection/Refs/OBrien%20et%20al%20data%20paper.pdf).

The GDELT data project is led by Philip Schrodt, Patrick Brandt, and Kalev Leetaru. The GDELT data aims to be a continuously updated "catalog of human societal-scale behavior and beliefs across all countries of the world.'' According to the documentation provided on their [website](http://gdelt.utdallas.edu), "GDELT event records are stored in an expanded version of the dyadic CAMEO format, capturing two actors and the action performed by Actor1 upon Actor2." From this design, it is possible to parse out the raw CAMEO actor codes, which facilitates direct user control of the data. In addition, for all events the Goldstein ranking score, a "tone" score, several indicators of "importance" based on media attention, and geo-referenced indicators are all provided. The data is available from January 1, 1979 to today. 

## The Set Up

Since both data resources have similar goals yet are produced through different approaches, a comparison between the data sources is likely to be fruitful to the broader research community. To illustrate the differences and highlight the strengths of each data source, we compare GDELT and ICEWS data for three regions: Egypt, Syria, and Turkey. We focus on the last year of events and specifically investigate protests, anti-government actions, and repression. 

While the data are collected via separate and distinct processes, we are able to compare them by focusing on actor sets. Each individual ICEWS event includes two variables, "Source.Sectors" and "Target.Sectors", which code the actors involved with a given event. From this we are able to pull out data on protestors and opposition actions (coded as "protestors", "opposition", "civilian", and "rebel") as well as government actors ("government", "military", "police"). Like ICEWS, GDELT lists two actors for each record. One of these is the "sender" and the other is the "receiver" of the action. These actor types are largely similar to those in the ICEWS coding scheme and so also allow us to obtain from the data the general actor sets composing government and anti-government actors. 

## What can we learn from each?

The visualizations presented herein illuminate several interesting features of the data. First, both data sets do seem to accurately capture significant events. For example, in the timeline graphic for Egypt, both data sets demonstrate spikes in protests near the time of the consitutional referendum and the anti-government march on the presidential palace. Similarly, both data sets show the rising tide of protest events in Turkey as a recent phenomenon. 

However, the two data sources do seem to differ in their reporting in that GDELT is more sensitive to media trends over time. Looking at the timeline for Syria, one can see that GDELT generally records more events than ICEWS but eventually fades over time. It appears that GDELT likely picks up on more media fatigue than does the ICEWS data; this seems to echo the suggestions of [David Masad](http://themonkeycage.org/2013/07/09/how-computers-can-help-us-track-violent-conflicts-including-right-now-in-syria/) and [Jay Ulfelder](http://dartthrowingchimp.wordpress.com/2013/05/16/challenges-in-measuring-violent-conflict-syria-edition/). As Ulfelder writes "
... press coverage of a sustained and intense conflicts is often high when hostilities first break out but then declines steadily thereafter. That decline can happen because editors and readers get bored, burned out, or distracted. It can also happen because the conflict gets so intense that it becomes, in a sense, too dangerous to cover." 

Last, while the process of production for the ICEWS data might result in a narrow, more highly vetted corpus of event data, it does not have the same geo-spatial sensitivity as GDELT. As is evident in the various maps provided here, GDELT's geographical distribution is more detailed. 

## Notes & To-do's:

At present, gdelt has "Nearly a quarter-billion georeferenced events capture global behavior in more than 300 categories covering 1979 to present with daily updates."

**action items:**

- Add in links in section 2 for who has done what with icews and gdelt? visualizations etc? 
- Add year availability for ICEWS. 
- We need a less jargon-y paragraph at the end of section 2 that bridges the two data sets and says something meaningful about them in terms of their general approach. Maybe Mike does this? 
- We need to add some descriptive stats probs


