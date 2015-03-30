Template.addField.helpers({
  showCreateDialog: function () {
  	console.log("update");
    console.log(Session.get("showCreateDialog"));
    return Session.get("showCreateDialog");
  },
  addFieldStepIs: function (step) {
    return Session.get("addFieldStep") === step;
  }
});
