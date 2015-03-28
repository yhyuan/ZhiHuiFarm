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
  },
  fields: function () {
      return Parties.find({});
    }
});

if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
window.ZhiHuiFarmUI.viewField = function (_id) {
  Session.set("fieldsMenuOption", "view");
  Session.set("currentViewedField", Parties.findOne(_id));
  console.log(Session.get("currentViewedField"));
};
