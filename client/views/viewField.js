Template.viewField.helpers({
  isPartyOwner: function () {
    return Session.get("currentViewedField").owner === Meteor.userId();
  },
  /*fieldsMenuOptionIs: function (fieldsMenuOption) {
    return Session.get("fieldsMenuOption") === fieldsMenuOption;
  },*/
  isBeingEdited: function () {
    return Session.get("isCurrentFieldsBeingEdit");
  },
  isActivitiesBeingEdited: function () {
    return Session.get("isActivitiesBeingEdited");
  },
  isCropsBeingEdited: function () {
    return Session.get("isCropsBeingEdited");
  },    
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
  //console.log('OK');
  Session.set("isCurrentFieldsBeingEdit", true);
};
window.ZhiHuiFarmUI.editCrops = function () {
  //console.log('OK');
  Session.set("isCropsBeingEdited", true);
  Session.set("currentViewedFieldCrops", Session.get("currentViewedField").crops);
};
window.ZhiHuiFarmUI.editActivities = function () {
  //console.log('OK');
  Session.set("isActivitiesBeingEdited", true);
  Session.set("currentViewedFieldActivities", Session.get("currentViewedField").activities);
};
