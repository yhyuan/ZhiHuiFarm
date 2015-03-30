Template.addField.helpers({
  showAddFieldDialog: function () {
    return Session.get("showAddFieldDialog");
  },
  addFieldStepIs: function (step) {
    return Session.get("addFieldStep") === step;
  }
});
