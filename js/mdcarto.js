var gui;
function initialize(){
	// var user_name = "mcdickenson";
	// var table_name = "gdelt_icews_20130725";
	// var column_name = "date";
	var user_name = "viz2";
	var table_name = "ow";
	var column_name = "date";

	// google map
	// centered on cairo
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

	var map_style = {};
	map_style.google_maps_customization_style = [
		{
			stylers:[
				{ invert_lightness:true },
				{ weight:1 },
				{ saturation:-100 },
				{ lightness:-40 }
			]
		},
		{
			elementType:"labels",
			stylers:[
				{ visibility:"simplified" }
			]
		}
	];

	var Soft = function(){
		this.Soft = function(){
			map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			map.setOptions({styles:map_style.google_maps_customization_style});
		}
	}

	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	map.setOptions({styles:map_style.google_maps_customization_style});

	var TorqueOptions = {
		user: user_name,
		table: table_name,
		column: column_name,
		cumulative: false,
		resolution: 2,
		fps: 12,
		fitbounds: false,
		clock: true,
		blendmode: 'lighter',
		trails: true,
		point_type:'circle',
		cellsize:1
	}

	var torque = null;
	Torque(function(env){
		Torque.app = new env.app.Instance();
		torque = new Torque.app.addLayer(map, TorqueOptions);
		Torque.env = env;
	});

}