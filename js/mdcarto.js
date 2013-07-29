var gui;
function initialize(){
	var user_name = "mcdickenson";
	var table_name = "gdelt_icews_20130725";
	var column_name = "date";

	// google map
	// todo: try out different base maps (dark)
	var map = new google.maps.Map(document.getElementById('map_canvas'), {
		center:new google.maps.LatLng(30.95940879245423, -0.609375),
		zoom:2,
		mapTypeId:google.maps.MapTypeId.SATELLITE,
		mapTypeControl:false,
		minZoom:1,
		scrollwheel: true,
		panControl: false,
		zoomControl: true,
		streetViewControl: false,
		overviewMapControl: false
	});
}