Template.viewField.helpers({
  isPartyOwner: function () {
    return Session.get("currentViewedField").owner === Meteor.userId();
  },
  beingEditedIs: function (beingEditedOption) {
    return Session.get('beingEditedOption') === beingEditedOption;
  },
/*
  isBeingEdited: function () {
    return Session.get("isCurrentFieldsBeingEdit");
  },
  isActivitiesBeingEdited: function () {
    return Session.get("isActivitiesBeingEdited");
  },
  isCropsBeingEdited: function () {
    return Session.get("isCropsBeingEdited");
  },*/
  title: function () {
  	return Session.get("currentViewedField").title;
  },
  calculateArea: function() {
      return Session.get("currentViewedFieldArea");
  },
  isCropsZero: function () {    
    return _.keys(Session.get("currentViewedField").crops).length === 0;
  },
  isActivitiesZero: function () {    
    return _.keys(Session.get("currentViewedField").activities).length === 0;
  },
  isStaffsZero: function () {    
    return Session.get("currentViewedField").staffs.length === 0;
  },
  isYieldsZero: function () {
    return Session.get("currentViewedField").yields.length === 0;
  },  
  cropsListInThisYear: function() {
      var crops = Crops.find({}).fetch();
      var cropsDict = _.object(_.map(crops, function(crop) {return crop.Id;}), _.map(crops, function(crop) {return crop.name;}));
      var keys = _.keys(Session.get("currentViewedField").crops);
      if (keys.length === 0) {
        return '';
      } 
      var maxKey = _.max(keys);// the most recent year. {2015: [1, 2, 3], 2014: [2, 3]}
      return _.map(Session.get("currentViewedField").crops[maxKey], function(cropId) {
        return {year: maxKey, name: cropsDict[cropId]};
      });      
  },
  activitiesInThisYear: function() {
      //var activities = Activities.find({}).fetch();
      //var activitiesDict = _.object(_.map(activities, function(activity) {return activity.Id;}), _.map(activities, function(activity) {return activity.name;}));
      //{2015: {1: [{date: '2015/03/15', activity: 1, performer: 'sagageaga'}], 2: [{date: '2015/03/15', activity: 1}], 3: [{date: '2015/03/15', activity: 1}]}, 2014: {2: [{date: '2015/03/15', activity: 1}], 3: [{date: '2015/03/15', activity: 1, performer: 'aafagaag'}]}
      var keys = _.keys(Session.get("currentViewedField").activities);
      if (keys.length === 0) {
        return 0;
      }
      var maxKey = _.max(keys);
      var thisYearActivities = Session.get("currentViewedField").activities[maxKey];
      return _.reduce(_.map(_.values(thisYearActivities), function(arr) {return arr.length;}), function(memo, num){ return memo + num; }, 0);
  },
  latestActivityName: function() {
      var activities = Activities.find({}).fetch();
      var activitiesDict = _.object(_.map(activities, function(activity) {return activity.Id;}), _.map(activities, function(activity) {return activity.name;}));

      var keys = _.keys(Session.get("currentViewedField").activities);
      var maxKey = _.max(keys);
      var thisYearActivities = Session.get("currentViewedField").activities[maxKey];
      var activitiesCombined = _.reduce(_.values(thisYearActivities), function(memo, num){ return memo.concat(num); }, []);
      var latestActivity = _.max(activitiesCombined, function(activity){ return activity.date; });
      return activitiesDict[latestActivity.activity];

  },
  latestActivityDate: function() {
      var keys = _.keys(Session.get("currentViewedField").activities);
      var maxKey = _.max(keys);
      var thisYearActivities = Session.get("currentViewedField").activities[maxKey];
      var activitiesCombined = _.reduce(_.values(thisYearActivities), function(memo, num){ return memo.concat(num); }, []);
      var latestActivity = _.max(activitiesCombined, function(activity){ return activity.date; });
      return latestActivity.date;

  },
  latestActivityPerformer: function() {
      var keys = _.keys(Session.get("currentViewedField").activities);
      var maxKey = _.max(keys);
      var thisYearActivities = Session.get("currentViewedField").activities[maxKey];
      var activitiesCombined = _.reduce(_.values(thisYearActivities), function(memo, num){ return memo.concat(num); }, []);
      var latestActivity = _.max(activitiesCombined, function(activity){ return activity.date; });
      return latestActivity.performer;
  }/*,
  cropsList: function() {
      var crops = Crops.find({}).fetch();
      var cropsDict = _.object(_.map(crops, function(crop) {return crop.Id;}), _.map(crops, function(crop) {return crop.name;}));
      var keys = _.keys(Session.get("currentViewedField").crops);
      if (keys.length === 0) {
        return '';
      } 
      var maxKey = _.max(keys);
      return maxKey + ': ' + _.map(Session.get("currentViewedField").crops[maxKey], function(cropId) {
        return cropsDict[cropId];
      }).join(',');
  }*/ 
});

if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
window.ZhiHuiFarmUI.editField = function () {
  Session.set('beingEditedOption', 'Field');
};

window.ZhiHuiFarmUI.editCrops = function () {
  Session.set('beingEditedOption', 'Crops');
  Session.set("currentViewedFieldCrops", Session.get("currentViewedField").crops);
};

window.ZhiHuiFarmUI.editActivities = function () {
  Session.set('beingEditedOption', 'Activities');
  Session.set("currentViewedFieldActivities", Session.get("currentViewedField").activities);

  var crops = Crops.find({}).fetch();
  var cropsDict = _.object(_.map(crops, function(crop) {return crop.Id;}), _.map(crops, function(crop) {return crop.name;}));

  var currentViewedFieldCrops = Session.get("currentViewedField").crops;
  var cropYear = _.map(_.keys(currentViewedFieldCrops), function(year) {
    var cropsInThisYear = currentViewedFieldCrops[year];
    return _.map(cropsInThisYear, function(cropId) {
      return {cropId: cropId, name: cropsDict[cropId], year: year};
    })
  });

  var cropsYears = _.reduce(cropYear, function(memo, num){ return memo.concat(num); }, []).sort(function(a,b) { return b.year - a.year; });
  cropsYears = _.map(_.range(cropsYears.length), function(i) {    
    return {index: i, cropId: cropsYears[i].cropId, name: cropsYears[i].name, year: cropsYears[i].year};
  });
  Session.set("currentViewedFieldCropsYears", cropsYears)
  Session.set("currentViewedFieldCropsYearsIndex", 0)
};
