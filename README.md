imagister
=========

Visualizations for GDELT and ICEWS, focused on Egypt, Syria, and Turkey.

There are at least three instances of word play in this repo title. Can you spot them all?

## d3

The initial plan is to use [d3](http://d3js.org/) ("data-driven documents") for this visualization. 

While we're in the development stage, I plan to preview locally. If you are not sure what this means, you can find info on this in the "D3 Tips and Tricks" book. 

When we get to the stage of having fellow Wardlab members comment on our work, let's use a Github Gist and [http://bl.ocks.org/](http://bl.ocks.org/). This process should make it easy to display and share our work on any other site (the Wardlab blog, FP, etc) in the future. 

## data

For both privacy and efficiency reasons, this repo should contain a minimum of data necessary for plotting. Ideally, this would contain the following columns:

```
SenderActor Action ReceiverActor  Date  Latitude  Longitude Source
```

`SenderActor` is either "govt" or "anti"; `ReceiverActor` is the opposite. `Action` will be one of "protest", "repress", or "fight". `Date`, `Latitude`, and `Longitude` are self-explanatory. `Source` is an indicator of whether the event is from ICEWS or GDELT.  

For now, these data should be in plain-text (.csv) format. As we progress toward public visualizations we may put them into a database format (eg MongoDB). 

## html

This is where we can put plain or marked-up text describing the project, in addition to the index page. If you prefer using haml or markdown that's fine too.  

## js

Other javascript libraries will go here.

## rcode 

This subdirectory should contain shell and/or R scripts for transforming GDELT and ICEWS data from its original format into the minimal viable subset described above.



