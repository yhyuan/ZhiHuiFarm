Template.addField.helpers({
  showCreateDialog: function () {
    //console.log(Session.get("showCreateDialog"));
    return Session.get("showCreateDialog");
  },
  addFieldStepIs: function (step) {
    return Session.get("addFieldStep") === step;
  }
});