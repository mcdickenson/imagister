var gui;
function initialize(){
	var user_name = "mcdickenson";
	var table_name = "gdelt_icews_20130725";
	var column_name = "date";

	// google map
	// centered on cairo
	// todo: try out different base maps (dark)
	var map = new google.maps.Map(document.getElementById('map_canvas'), {
		center:new google.maps.LatLng(30.05, 31.226),
		zoom:5,
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		mapTypeControl:false,
		minZoom:3,
		scrollwheel: true,
		panControl: false,
		zoomControl: true,
		streetViewControl: false,
		overviewMapControl: false
	});
}