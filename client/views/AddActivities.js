
Template.AddActivities.rendered = function(){
  $('#activityDate').datepicker({
    format: 'yyyy-mm-dd'
  });
};

Template.AddActivities.helpers({
  currentCropYear: function () {
    var cropsYears =  Session.get("currentViewedFieldCropsYears");
    var firstCropYear = cropsYears[Session.get("currentViewedFieldCropsYearsIndex")];
    return firstCropYear.name + ' -- ' + firstCropYear.year + ' (' + Session.get("currentViewedField").title + ')';
  },
  currentDate: function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    return yyyy + '-' + mm + '-' + dd;
   
  },
  activities: function () {
    return Activities.find({});
  }
});

Template.AddActivities.events({
    'click #saveActivityButton' : function(event, template){
         //var el = template.loading;
      console.log('OK OK');     
      Session.set('addingActivities', false);    
    }
});
/*
if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}

window.ZhiHuiFarmUI.saveActivity = function () {
//  Session.set('addingActivities', true);
  console.log('OK');
};

*/