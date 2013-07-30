var gui;
function initialize(){
	var user_name = "mcdickenson";
	var table_name = "gdelt_icews_20130725";
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
		zoomControl: false,
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

  var blend_modes = [
    "lighter",
    "source-over",
    "copy",
    "destination-atop",
    "destination-in",
    "destination-out",
    "destination-over",
    "source-atop",
    "source-in",
    "source-out",
    "xor"
	];

	function init_slider(that){
		var that_opts = that.options;
		$('body').append('<div id="torque-slider"></div>');
		$("#torque-slider").slider({
			min: Math.round(that_opts.start),
			max: Math.floor(that_opts.end),
			value: Math.round(that_opts.start),
			step: that._step,
			slide: function(event, ui){
				that._current = ui.value;
				var date = new Date(that._current*1000);
				var date_arry = date.toString().substr(4).split(' ');
				that._display.set_time((that._current - that.start) / that._step);
			}
		});
	};

	function on_move(that){
		$("#torque-slider").slider({value: that._current });
	}

	var TorqueOptions = {
		user: user_name,
		table: table_name,
		column: column_name,
		cumulative: false,
		steps:450,
		resolution: 3,
		fps: 18,
		fitbounds: false,
		clock: true,
		blendmode: blend_modes[1],
		trails: true,
		point_type:'circle',
		cellsize:3,
		// autoplay: true,
		scrub: init_slider,
		scrub_move: on_move
	}

	var torque = null;
	Torque(function(env){
		Torque.app = new env.app.Instance();
		torque = new Torque.app.addLayer(map, TorqueOptions);
		Torque.env = env;

		var pause = $('<a></a>');
		$(pause).attr('id', 'torque-pause')
		$(pause).addClass("playing");
		$('body').append(pause);
		$(pause).click(function(){
			if($(this).hasClass("paused")){
				torque.pause();
				$(this).removeClass("paused");
				$(this).addClass("playing");
			} else {
				$(this).removeClass("playing");
				$(this).addClass("paused");
				torque.pause();
			}
		});
	});

}