
Template.editActivities.helpers({
  addingActivities: function () {
    return Session.get('addingActivities');
  },
  isActivitiesZero: function () {
    var cropsYears =  Session.get("currentViewedFieldCropsYears");
    var firstCropYear = cropsYears[Session.get("currentViewedFieldCropsYearsIndex")];
    //console.log(firstCropYear);
    var year = firstCropYear.year;
    var cropId = firstCropYear.cropId;
    var activities = Session.get("currentViewedField").activities;
    if (!activities.hasOwnProperty(year)) {
      return true;
    }
    if (!activities[year].hasOwnProperty(cropId)) {
      return true;
    } 
    return false;
  },
  activitiesList: function () {
    var cropsYears =  Session.get("currentViewedFieldCropsYears");
    var firstCropYear = cropsYears[Session.get("currentViewedFieldCropsYearsIndex")];
    var year = firstCropYear.year;
    var cropId = firstCropYear.cropId;
    var activitiesCurrentField = Session.get("currentViewedField").activities;

    var activities = Activities.find({}).fetch();
    var activitiesDict = _.object(_.map(activities, function(activity) {return activity.Id;}), _.map(activities, function(activity) {return activity.name;}));  
    return _.map(activitiesCurrentField[year][cropId], function(act) {
      return {date: act.date, activity: activitiesDict[act.activity], performer: act.performer, activityId: act.activity, performerId: act.performer};
    });
  },
  cropsYears: function () {
    return Session.get("currentViewedFieldCropsYears");
  }/*,
  yearCropsInField: function () {
    var crops = Crops.find({}).fetch();
    var cropsDict = _.object(_.map(crops, function(crop) {return crop.Id;}), _.map(crops, function(crop) {return crop.name;}));
    var results = _.map(_.keys(Session.get("currentViewedFieldCrops")), function(year) {
      var cropsInField = _.map(Session.get("currentViewedFieldCrops")[year], function(cropId) {
        return {Id: cropId, name: cropsDict[cropId], year: year};
      });
      return {year: year, cropsInField: cropsInField};
    });
    results = results.sort(function(a,b) { return b.year - a.year; });
    console.log(results);
    return results;
  },
  activities: function () {
    return Activities.find({});
  },
  years: function () {
    return _.map(_.range(new Date().getFullYear(), 2000, -1), function(year) {
      return {name: year};
    });
  }*/
});

if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
/*
window.ZhiHuiFarmUI.saveCrops = function () {
  var field = _.clone(Session.get("currentViewedField"));
  field.crops = Session.get("currentViewedFieldCrops");
  Session.set("currentViewedField", field);
  updateParty({
      _id: field._id,
      title: field.title,
      description: field.description,
      boundary: field.boundary,
      crops: field.crops
  });      
  //console.log(Session.get("currentViewedField"));
  Session.set("isCropsBeingEdited", false);
};
*/
window.ZhiHuiFarmUI.deleteActivity = function (year, id) {
  var currentCrops = _.clone(Session.get("currentViewedFieldCrops"));
  currentCrops[year] = _.filter(currentCrops[year], function(currentId) {
    return currentId !== id;
  });

  if (currentCrops[year].length === 0) {
    delete currentCrops[year];
  }
  Session.set("currentViewedFieldCrops", currentCrops)
};

window.ZhiHuiFarmUI.addActivity = function () {
  Session.set('addingActivities', true);
};

window.ZhiHuiFarmUI.CropsYearsSelectListChanged = function (value) {
  Session.set("currentViewedFieldCropsYearsIndex", parseInt(value));
};
