// All Tomorrow's Parties -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Parties
getUserLanguage = function () {
  // Put here the logic for determining the user language
  return "zh-CN";
};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
  });
}

Crops = new Mongo.Collection("crops");
Activities = new Mongo.Collection("activities");


/*
  Each party is represented by a document in the Parties collection:
    owner: user id
    x, y: Number (screen coordinates in the interval [0, 1])
    title, description: String
    public: Boolean
    invited: Array of user id's that are invited (only if !public)
    rsvps: Array of objects like {user: userId, rsvp: "yes"} (or "no"/"maybe")
*/
Parties = new Mongo.Collection("parties");

Parties.allow({
  insert: function (userId, party) {
    return false; // no cowboy inserts -- use createParty method
  },
  update: function (userId, party, fields, modifier) {
    if (userId !== party.owner)
      return false; // not the owner

    var allowed = ["title", "description", "boundary", "crops", "staffs", "activities"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, party) {
    // You can only remove parties that you created and nobody is going to.
    return party.owner === userId;
  }
});

attending = function (party) {
  return (_.groupBy(party.rsvps, 'rsvp').yes || []).length;
};

var validateLatlng = function(latlng) {
  return latlng.lat >= -90 && latlng.lat <= 90 &&  latlng.lng >= -180 && latlng.lng <= 180;
};

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});
var StringArray = Match.Where(function (xs) {
  check(xs, Array);
  for (var i=0;i<xs.length;i++) {
    check(xs[i], String);
  }
  return true;
});
var Coordinate = Match.Where(function (x) {
  check(x.lat, Number);
  check(x.lng, Number);
  
  return validateLatlng(x);
});

var CoordinateArray = Match.Where(function (xs) {
  check(xs, Array);
  for (var i=0;i<xs.length;i++) {
    check(xs[i].lat, Number);
    check(xs[i].lng, Number);
    if (!validateLatlng(xs[i])) {
      return false;
    }
  }
  return true;
});
var GeojsonFeatureCollection = Match.Where(function (x) {
  check(x, Object);
  return true;
});

var LargeThanZeroNumber = Match.Where(function (x) {
  check(x, Number);
  return x > 0;
});

var CropsCheck = Match.Where(function (crops) {
  check(crops, Object);
  
  var years = _.keys(crops)
  if(years.length === 0) {
    return true;
  }
/*
  for (var i=0;i<years.length;i++) {
    console.log(years[i]);
    if((parseInt(years[i]) <= 2000) || (parseInt(years[i]) > new Date().getFullYear())) {
      return false;
    }
    var cropList = crops[years[i]];
    check(cropList, Array);
  }
  */
  return true;
});

createParty = function (options) {
  var id = Random.id();
  Meteor.call('createParty', _.extend({ _id: id }, options));
  return id;
};
updateParty = function (options) {
  Meteor.call('updateParty', options);
  //return id;  
}
Meteor.methods({
  // options should include: title, description, x, y, public

updateParty: function (options) {
    check(options, {
      title: NonEmptyString,
      description: NonEmptyString,
      boundary: GeojsonFeatureCollection,
      crops: CropsCheck,
      //public: Match.Optional(Boolean),
      _id: Match.Optional(NonEmptyString)
    });

    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    Parties.update(options._id, {
      $set: {
        boundary: options.boundary, //options.boundary,
        title: options.title,
        description: options.description,
        crops: options.crops
      }
    });    
  },     
  createParty: function (options) {
    check(options, {
      title: NonEmptyString,
      description: NonEmptyString,
      boundary: GeojsonFeatureCollection,
      //public: Match.Optional(Boolean),
      _id: Match.Optional(NonEmptyString)
    });

    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    var id = options._id || Random.id();
    //console.log(options.description);
    /*var userIds = _.map(options.description, function(email) {
      var user = Meteor.users.findOne({"emails.address": email});
      return (user) ? user._id : '';
    });*/

    //console.log(options.boundary);

    Parties.insert({
      _id: id,
      owner: this.userId,
      boundary: options.boundary, //options.boundary,
      title: options.title,
      description: options.description,
      //public: !! options.public,
      staffs: [],
      crops: {},
      activities: {},
      yields: []
    });
    return id;
  },

  invite: function (partyId, userId) {
    check(partyId, String);
    check(userId, String);
    var party = Parties.findOne(partyId);
    if (! party || party.owner !== this.userId)
      throw new Meteor.Error(404, "No such party");
    if (party.public)
      throw new Meteor.Error(400,
                             "That party is public. No need to invite people.");
    if (userId !== party.owner && ! _.contains(party.invited, userId)) {
      Parties.update(partyId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));
      if (Meteor.isServer && to) {
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "noreply@example.com",
          to: to,
          replyTo: from || undefined,
          subject: "PARTY: " + party.title,
          text:
"Hey, I just invited you to '" + party.title + "' on All Tomorrow's Parties." +
"\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },

  rsvp: function (partyId, rsvp) {
    check(partyId, String);
    check(rsvp, String);
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");
    var party = Parties.findOne(partyId);
    if (! party)
      throw new Meteor.Error(404, "No such party");
    if (! party.public && party.owner !== this.userId &&
        !_.contains(party.invited, this.userId))
      // private, but let's not tell this to the user
      throw new Meteor.Error(403, "No such party");

    var rsvpIndex = _.indexOf(_.pluck(party.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Parties.update(
          {_id: partyId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        Parties.update(partyId, modifier);
      }

      // Possible improvement: send email to the other people that are
      // coming to the party.
    } else {
      // add new rsvp entry
      Parties.update(partyId,
                     {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
    }
  }
});

///////////////////////////////////////////////////////////////////////////////
// Users

displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};
