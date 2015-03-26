Template.fields.helpers({
  /*showInviteDialog: function () {
    return Session.get("showInviteDialog");
  },
  showCreateDialog: function () {
    return Session.get("showCreateDialog");
  },*/
  isParties: function () {
    return Parties.find().count() !== 0;
  },
  fieldsMenuOptionIs: function (fieldsMenuOption) {
    return Session.get("fieldsMenuOption") === fieldsMenuOption;
  }
});
