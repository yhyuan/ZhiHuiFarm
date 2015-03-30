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
  //console.log('OK');
  Session.set("isCurrentFieldsBeingEdit", true);
};