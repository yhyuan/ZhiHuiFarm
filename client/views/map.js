///////////////////////////////////////////////////////////////////////////////
// Map display

$(window).resize(function () {
  var h = $(window).height(), offsetTop = 90; // Calculate the top offset
  $mc = $('#map_canvas');
  $mc.css('height', (h - offsetTop));
}).resize();

var openCreateDialog = function (field) {
  Session.set("createField", field);
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

var map, markers = [ ];

var initialize = function(element, centroid, zoom, features) {
  var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map',{maxZoom:18,minZoom:5}),
      normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion',{maxZoom:18,minZoom:5}),
      imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map',{maxZoom:18,minZoom:5}),
      imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion',{maxZoom:18,minZoom:5});
  var normal = L.layerGroup([normalm,normala]),
      image = L.layerGroup([imgm,imga]);
  var baseLayers = {
      "地图":normal,
      "影像":image,
  }
  var overlayLayers = {
      
  }

  map = L.map(element, {
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    layers:[normal]
  }).setView(new L.LatLng(centroid[0], centroid[1]), zoom);
  L.control.layers(baseLayers,overlayLayers).addTo(map);
//  L.control.zoom({zoomInTitle:'放大', zoomOutTitle:'缩小'}).addTo(map);

  //L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {opacity: .5}).addTo(map);

  map.attributionControl.setPrefix('');
  /*
  var attribution = new L.Control.Attribution();
  attribution.addAttribution("Geocoding data &copy; 2013 <a href='http://open.mapquestapi.com'>MapQuest, Inc.</a>");
  attribution.addAttribution("Map tiles by <a href='http://stamen.com'>Stamen Design</a> under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>.");
  attribution.addAttribution("Data by <a href='http://openstreetmap.org'>OpenStreetMap</a> under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.");
  
  map.addControl(attribution);
  */
      map.on("dblclick", function(e) {
      if (! Meteor.userId()) // must be logged in to create parties
        return;
      if (boundary.length >= 2) {
        boundary.push(e.latlng);

        openCreateDialog({center: calculateCenter(boundary), boundary: boundary, area: calculateArea([_.map(boundary, function(latlng) {return [latlng.lat, latlng.lng];})])});
        boundary = [];        
        return;
      }
      boundary.push(e.latlng);
    });    
    map.on("click", function(e) {
      if (! Meteor.userId()) // must be logged in to create parties
        return;
      /*if ((boundary.length >= 3) && (calculateDistance(boundary[0], e.latlng) < 0.00001)) {
        openCreateDialog(calculateCenter(boundary), boundary);
        boundary = [];        
        return;
      }*/
      boundary.push(e.latlng);
    });
    
    map.on("mousemove", function(e) {
      if (! Meteor.userId()) // must be logged in to create parties
        return;
      if (boundary.length >= 1) {
        if (polygon) {
          map.removeLayer(polygon); 
        }

        polygon = L.polygon( boundary.concat([e.latlng]));
        map.addLayer(polygon);
      }
    });
}

var addMarker = function(marker) {
  map.addLayer(marker);
  markers[marker.options._id] = marker;
}

var removeMarker = function(_id) {
  var marker = markers[_id];
  if (map.hasLayer(marker)) map.removeLayer(marker);
}

var createIcon = function(party) {
  var className = 'leaflet-div-icon ';
  className += party.public ? 'public' : 'private';
  return L.divIcon({
    iconSize: [30, 30],
    html: '<b>' + attending(party) + '</b>',
    className: className  
  });
}

Template.map.created = function() {
  Parties.find({}).observe({
    added: function(party) {
      var marker = new L.Marker(party.latlng, {
        _id: party._id,
        icon: createIcon(party)
      }).on('click', function(e) {
        Session.set("selected", e.target.options._id);
      });      
      addMarker(marker);
    },
    changed: function(party) {
      var marker = markers[party._id];
      if (marker) marker.setIcon(createIcon(party));
    },
    removed: function(party) {
      removeMarker(party._id);
    }
  });
}
var polygon, boundary = [];
var calculateDistance = function (latlng1, latlng2) {
	return Math.abs(latlng1.lat - latlng2.lat) + Math.abs(latlng1.lng - latlng2.lng);
};
var calculateCenter = function (latlngs) {
	var latSum = _.reduce(latlngs, function(total, latlng){ return total + latlng.lat;}, 0.0);
	var lngSum = _.reduce(latlngs, function(total, latlng){ return total + latlng.lng;}, 0.0);
	return {lat: latSum/latlngs.length, lng: lngSum/latlngs.length};
};
   var calculateArea = function(coords) {
        var RADIUS = 6378137; /*wgs84*/
        /**
         * Calculate the approximate area of the polygon were it projected onto
         *     the earth.  Note that this area will be positive if ring is oriented
         *     clockwise, otherwise it will be negative.
         *
         * Reference:
         * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
         *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
         *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
         *
         * Returns:
         * {float} The approximate signed geodesic area of the polygon in square
         *     meters.
         */

        var ringArea = function (coords) {
            var area = 0;
            var rad = function (_) {
                return _ * Math.PI / 180;
            };
            if (coords.length > 2) {
                var p1, p2;
                for (var i = 0; i < coords.length - 1; i++) {
                    p1 = coords[i];
                    p2 = coords[i + 1];
                    area += rad(p2[0] - p1[0]) * (2 + Math.sin(rad(p1[1])) + Math.sin(rad(p2[1])));
                }

                area = area * RADIUS * RADIUS / 2;
            }

            return area;
        }        
          var area = 0;
          if (coords && coords.length > 0) {
              area += Math.abs(ringArea(coords[0]));
              console.log(coords);
              for (var i = 1; i < coords.length; i++) {
                  area -= Math.abs(ringArea(coords[i]));
              }
          }
          return area;
    };

Template.map.rendered = function () { 
  // basic housekeeping
  $(window).resize(function () {
    var h = $(window).height(), offsetTop = 90; // Calculate the top offset
    $('#map_canvas').css('height', (h - offsetTop));
  }).resize();

  //console.log('Template.map.rendered');
  var defaultLatLng = [ 39.56349, 117.55405 ];
  var defaultZoomLevel = 8;
  var positioningErrorHandler = function (error) {
    initialize($("#map_canvas")[0], defaultLatLng, defaultZoomLevel);
    //console.log('GPS is banned.');
  /*
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
    }*/
  };
  var positioningSuccessHandler = function (position) {
    console.log('GPS is good.');
    initialize($("#map_canvas")[0], [ position.coords.latitude, position.coords.longitude], 13);
  };
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(positioningSuccessHandler, positioningErrorHandler);
  } else {
      console.log('NO GPS');
      initialize($("#map_canvas")[0], defaultLatLng, defaultZoomLevel);
  }

  // initialize map events
  //if (!map) {
    //initialize($("#map_canvas")[0], [ 39.56349, 117.55405 ], 13);

    /*
    var self = this;
    Meteor.autorun(function() {
      var selectedParty = Parties.findOne(Session.get("selected"));
      if (selectedParty) {
        if (!self.animatedMarker) {
          var line = L.polyline([[selectedParty.latlng.lat, selectedParty.latlng.lng]]);
          self.animatedMarker = L.animatedMarker(line.getLatLngs(), {
            autoStart: false,
            distance: 3000,  // meters
            interval: 200, // milliseconds
            icon: L.divIcon({
              iconSize: [50, 50],
              className: 'leaflet-animated-icon'
            })
          });
          map.addLayer(self.animatedMarker);
        } else {
          // animate to here
          var line = L.polyline([[self.animatedMarker.getLatLng().lat, self.animatedMarker.getLatLng().lng],
            [selectedParty.latlng.lat, selectedParty.latlng.lng]]);
          self.animatedMarker.setLine(line.getLatLngs());
          self.animatedMarker.start();
        } 
      }
    })*/
  //}
};