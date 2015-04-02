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
      var maxKey = _.max(keys);
      return _.map(Session.get("currentViewedField").crops[maxKey], function(cropId) {
        return {year: maxKey, name: cropsDict[cropId]};
      });      
      /*
      return maxKey + ': ' + _.map(Session.get("currentViewedField").crops[maxKey], function(cropId) {
        return cropsDict[cropId];
      }).join(',');*/
  },
  activitiesList: function() {
      var activities = Activities.find({}).fetch();
      var activitiesDict = _.object(_.map(activities, function(activity) {return activity.Id;}), _.map(activities, function(activity) {return activity.name;}));
      var keys = _.keys(Session.get("currentViewedField").activities);
      if (keys.length === 0) {
        return '';
      } 
      var maxKey = _.max(keys);
      return maxKey + ': ' + _.map(Session.get("currentViewedField").activities[maxKey], function(activityId) {
        return activitiesDict[activityId];
      }).join(',');
  },
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
  }  
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
};
