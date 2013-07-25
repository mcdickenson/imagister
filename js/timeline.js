var minDate = new Date("2012-06-01");
var maxDate = new Date("2012-06-04");

var records=[
	{
		"SenderActor": "anti",
		"Action": "protest",
		"ReceiverActor": "govt",
		"Date": "2012-06-01",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "anti",
		"Action": "protest",
		"ReceiverActor": "govt",
		"Date": "2012-06-02",
		"Latitude": 29.9737,
		"Longitude": 32.5263,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "anti",
		"Action": "protest",
		"ReceiverActor": "govt",
		"Date": "2012-06-02",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "anti",
		"Action": "protest",
		"ReceiverActor": "govt",
		"Date": "2012-06-02",
		"Latitude": 30.0626,
		"Longitude": 31.2497,
		"Country": "Egypt",
		"Source": "icews"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-02",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-02",
		"Latitude": 29.9737,
		"Longitude": 32.5263,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-02",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-03",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-03",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "icews"
	}
];

Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf())
   dat.setDate(dat.getDate() + days);
   return dat;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(currentDate.toDateString());
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

var daySeq = getDates(minDate, maxDate);

var dayCounts = [];

for(var i=0; i<daySeq.length; i++){
	dayCounts[daySeq[i]] = 0;
}

for(var i=0; i<records.length; i++){
	var ix = (new Date(records[i].Date)).toDateString();
	dayCounts[ix] += 1;
}
console.log(dayCounts);

