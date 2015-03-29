Template.fields.helpers({
  isParties: function () {
    return Parties.find().count() !== 0;
  },
  fieldsMenuOptionIs: function (fieldsMenuOption) {
    return Session.get("fieldsMenuOption") === fieldsMenuOption;
  },
  fields: function () {
      return Parties.find({});
    }
});

Template.field.helpers({
  calculateCenter: function (latlngs) {
   var latSum = _.reduce(latlngs, function(total, latlng) {
        return total + latlng.lat;
    }, 0.0);
    var lngSum = _.reduce(latlngs, function(total, latlng) {
        return total + latlng.lng;
    }, 0.0);
    var center = {
        lat: latSum / latlngs.length,
        lng: lngSum / latlngs.length
    };
    return '' + center.lat + ', ' + center.lng;
   },
   convertBoundaryString: function (latlngs) {
    return '[' + _.map(latlngs, function(latlng) {return '[' + latlng.lat + ',' + latlng.lng + ']'}).join(',') + ']';
   },
   calculateArea: function(latlngs) {
      var calculateDistance = function(fromLatlng, toLatlng) {
          var EARTH_RADIUS = 6378137; // in meter

          var toRad = function(degree) {
              return degree * Math.PI / 180;
          };
          var lat1 = toRad(fromLatlng.lat);
          var lng1 = toRad(fromLatlng.lng);
          var lat2 = toRad(toLatlng.lat);
          var lng2 = toRad(toLatlng.lng);
          var d = EARTH_RADIUS * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng1 - lng2));
          return d;
      };
      var closedLatlngs = (calculateDistance(latlngs[0], latlngs[latlngs.length - 1]) > 0) ? latlngs.concat([latlngs[0]]) : latlngs;
      var coords = [_.map(closedLatlngs, function(latlng) {return [latlng.lat, latlng.lng]})];

        var RADIUS = 6378137; //wgs84
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

        var ringArea = function(coords) {
            var area = 0;
            var rad = function(_) {
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
            for (var i = 1; i < coords.length; i++) {
                area -= Math.abs(ringArea(coords[i]));
            }
        }
        return (area/10000).toFixed(2); //Convert it from sqared meter to hectare
    }   
});

if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
window.ZhiHuiFarmUI.viewField = function (_id) {
  Session.set("fieldsMenuOption", "view");
  Session.set("currentViewedField", Parties.findOne(_id));
  //console.log(Session.get("currentViewedField"));
};

/*
    
    var openCreateDialog = function(field) {
        Session.set("createField", field);
        Session.set("createError", null);
        Session.set("showCreateDialog", true);
    };    
    var latlngs = _.map(markers, function(m) {return m.getLatLng();});
    var latlngsArray = _.map(markers, function(m) {return [m.getLatLng().lat, m.getLatLng().lng];});
    openCreateDialog({center: calculateCenter(latlngs), boundary: boundary, area: calculateArea([latlngsArray.concat([latlngsArray[0]])])});
    */
