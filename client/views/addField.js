Template.addField.helpers({
  showAddFieldDialog: function () {
  	//console.log("update");
    //console.log(Session.get("showCreateDialog"));
    return Session.get("showAddFieldDialog");
  },
  addFieldStepIs: function (step) {
    return Session.get("addFieldStep") === step;
  }
});
