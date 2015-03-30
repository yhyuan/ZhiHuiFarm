Template.viewField.helpers({
  isPartyOwner: function () {
    return Session.get("currentViewedField").owner === Meteor.userId();
  },
  fieldsMenuOptionIs: function (fieldsMenuOption) {
    return Session.get("fieldsMenuOption") === fieldsMenuOption;
  },
  title: function () {
  	return Session.get("currentViewedField").title;
  },
  calculateArea: function() {
      return Session.get("currentViewedFieldArea");
  }
});

if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
window.ZhiHuiFarmUI.editField = function () {
  Session.set("fieldsMenuOption", "edit");
};