Template.deleteFieldDialog.helpers({
  currentViewedFieldTitle: function () {
    return Session.get("currentViewedField").title;
  }
});

if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
window.ZhiHuiFarmUI.confirmDeleteField = function () {
    var _id = Session.get("currentViewedField")._id;
    Parties.remove(_id);
  $('#deleteDialogModal').modal('hide');
  Session.set('fieldsMenuOption', 'main');
};
