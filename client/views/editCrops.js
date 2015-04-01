
Template.editCrops.helpers({
  isCropsZero: function () {    
    return _.keys(Session.get("currentViewedFieldCrops")).length === 0;
  },
  /*cropsInField: function () {
    var crops = Crops.find({}).fetch();
    var cropsDict = _.object(_.map(crops, function(crop) {return crop.Id;}), _.map(crops, function(crop) {return crop.name;}));  
    return _.filter(crops, function(crop) {
      return _.contains(Session.get("currentViewedFieldCrops"), crop.Id);
    });
  },*/
  yearCropsInField: function () {
    var crops = Crops.find({}).fetch();
    var cropsDict = _.object(_.map(crops, function(crop) {return crop.Id;}), _.map(crops, function(crop) {return crop.name;}));
    var results = _.map(_.keys(Session.get("currentViewedFieldCrops")), function(year) {
      var cropsInField = _.map(Session.get("currentViewedFieldCrops")[year], function(cropId) {
        return {Id: cropId, name: cropsDict[cropId], year: year};
      });
      return {year: year, cropsInField: cropsInField};
    });
    return results.sort(function(a,b) { return b.year - a.year; });
    /*
    return _.filter(crops, function(crop) {
      return _.contains(, crop.Id);
    });*/
  },
  crops: function () {
    return Crops.find({});
  },
  years: function () {
    return _.map(_.range(new Date().getFullYear(), 2000, -1), function(year) {
      return {name: year};
    });
  }
});

if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
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

window.ZhiHuiFarmUI.deleteCrop = function (year, id) {
  var currentCrops = _.clone(Session.get("currentViewedFieldCrops"));
  currentCrops[year] = _.filter(currentCrops[year], function(currentId) {
    return currentId !== id;
  });

  if (currentCrops[year].length === 0) {
    delete currentCrops[year];
  }
  Session.set("currentViewedFieldCrops", currentCrops)
};

window.ZhiHuiFarmUI.addCrop = function () {
  var cropName = $('#cropSelectList').val();
  var crops = Crops.find({}).fetch();
  var cropId = _.filter(crops, function(crop) {
    return crop.name === cropName;
  })[0].Id;
  var year = $('#yearSelectList').val();
  var currentCrops = _.clone(Session.get("currentViewedFieldCrops"));
  if (currentCrops.hasOwnProperty(year)) {
    if (!_.contains(currentCrops[year], cropId)) {
      currentCrops[year] = currentCrops[year].concat([cropId]);
      Session.set("currentViewedFieldCrops", currentCrops);
    }
  } else {
    currentCrops[year] = [cropId];
    Session.set("currentViewedFieldCrops", currentCrops);
  }
};
