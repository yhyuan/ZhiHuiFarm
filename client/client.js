// All Tomorrow's Parties -- client

Meteor.subscribe("directory");
Meteor.subscribe("parties");

// If no party selected, or if the selected party was deleted, select one.
Meteor.startup(function () {
  Deps.autorun(function () {
    var selected = Session.get("selected");
    if (! selected || ! Parties.findOne(selected)) {
      var party = Parties.findOne();
      if (party)
        Session.set("selected", party._id);
      else
        Session.set("selected", null);
    }
  });
});

///////////////////////////////////////////////////////////////////////////////
// Party details sidebar

Template.details.party = function () {
  return Parties.findOne(Session.get("selected"));
};

Template.details.anyParties = function () {
  return Parties.find().count() > 0;
};

Template.details.creatorName = function () {
  var owner = Meteor.users.findOne(this.owner);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
};

Template.details.canRemove = function () {
  return this.owner === Meteor.userId() && attending(this) === 0;
};

Template.details.maybeChosen = function (what) {
  var myRsvp = _.find(this.rsvps, function (r) {
    return r.user === Meteor.userId();
  }) || {};

  return what == myRsvp.rsvp ? "chosen btn-inverse" : "";
};

Template.details.events({
  'click .rsvp_yes': function () {
    Meteor.call("rsvp", Session.get("selected"), "yes");
    return false;
  },
  'click .rsvp_maybe': function () {
    Meteor.call("rsvp", Session.get("selected"), "maybe");
    return false;
  },
  'click .rsvp_no': function () {
    Meteor.call("rsvp", Session.get("selected"), "no");
    return false;
  },
  'click .invite': function () {
    openInviteDialog();
    return false;
  },
  'click .remove': function () {
    Parties.remove(this._id);
    return false;
  }
});

///////////////////////////////////////////////////////////////////////////////
// Party attendance widget

Template.attendance.rsvpName = function () {
  var user = Meteor.users.findOne(this.user);
  return displayName(user);
};

Template.attendance.outstandingInvitations = function () {
  var party = Parties.findOne(this._id);
  return Meteor.users.find({$and: [
    {_id: {$in: party.invited}}, // they're invited
    {_id: {$nin: _.pluck(party.rsvps, 'user')}} // but haven't RSVP'd
  ]});
};

Template.attendance.invitationName = function () {
  return displayName(this);
};

Template.attendance.rsvpIs = function (what) {
  return this.rsvp === what;
};

Template.attendance.nobody = function () {
  return ! this.public && (this.rsvps.length + this.invited.length === 0);
};

Template.attendance.canInvite = function () {
  return ! this.public && this.owner === Meteor.userId();
};

///////////////////////////////////////////////////////////////////////////////
// Map display

$(window).resize(function () {
  var h = $(window).height(), offsetTop = 90; // Calculate the top offset
  $mc = $('#map_canvas');
  $mc.css('height', (h - offsetTop));
}).resize();

var map, markers = [ ];

var initialize = function(element, centroid, zoom, features) { 
  map = L.map(element, {
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false
  }).setView(new L.LatLng(centroid[0], centroid[1]), zoom);
  
  L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {opacity: .5}).addTo(map);

  map.attributionControl.setPrefix('');
  
  var attribution = new L.Control.Attribution();
  attribution.addAttribution("Geocoding data &copy; 2013 <a href='http://open.mapquestapi.com'>MapQuest, Inc.</a>");
  attribution.addAttribution("Map tiles by <a href='http://stamen.com'>Stamen Design</a> under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>.");
  attribution.addAttribution("Data by <a href='http://openstreetmap.org'>OpenStreetMap</a> under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.");
  
  map.addControl(attribution);
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

Template.map.rendered = function () { 
  // basic housekeeping
  $(window).resize(function () {
    var h = $(window).height(), offsetTop = 90; // Calculate the top offset
    $('#map_canvas').css('height', (h - offsetTop));
  }).resize();
  
  // initialize map events
  if (!map) {
    initialize($("#map_canvas")[0], [ 39.56349, 117.55405 ], 13);

    map.on("dblclick", function(e) {
      if (! Meteor.userId()) // must be logged in to create parties
        return;
      if (boundary.length >= 2) {
      	boundary.push(e.latlng);
      	openCreateDialog(calculateCenter(boundary), boundary);
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
    })
  }
};

///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

var openCreateDialog = function (latlng, boundary) {
  Session.set("createCoords", latlng);
  Session.set("createBoundary", boundary);
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.page.showCreateDialog = function () {
  return Session.get("showCreateDialog");
};

Template.createDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var latlng = Session.get("createCoords");
    var boundary = Session.get("createBoundary");

    if (title.length && description.length) {
      var id = createParty({
        title: title,
        description: description,
        latlng: latlng,
        boundary: boundary,
        public: public
      });

      Session.set("selected", id);
      if (! public && Meteor.users.find().count() > 1)
        openInviteDialog();
      Session.set("showCreateDialog", false);
    } else {
      Session.set("createError",
                  "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.error = function () {
  return Session.get("createError");
};

///////////////////////////////////////////////////////////////////////////////
// Invite dialog

var openInviteDialog = function () {
  Session.set("showInviteDialog", true);
};

Template.page.showInviteDialog = function () {
  return Session.get("showInviteDialog");
};

Template.inviteDialog.events({
  'click .invite': function (event, template) {
    Meteor.call('invite', Session.get("selected"), this._id);
  },
  'click .done': function (event, template) {
    Session.set("showInviteDialog", false);
    return false;
  }
});

Template.inviteDialog.uninvited = function () {
  var party = Parties.findOne(Session.get("selected"));
  if (! party)
    return []; // party hasn't loaded yet
  return Meteor.users.find({$nor: [{_id: {$in: party.invited}},
                                   {_id: party.owner}]});
};

Template.inviteDialog.displayName = function () {
  return displayName(this);
};
