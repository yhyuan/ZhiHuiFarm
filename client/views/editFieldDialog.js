Template.editFieldDialog.rendered = function() {
  $("#fieldNameEditField" ).val( Session.get("currentViewedField").title );
  $("#fieldDescriptionEditField" ).val( Session.get("currentViewedField").description );
}

if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
window.ZhiHuiFarmUI.confirmEditField = function () {
    var title = $('#fieldNameEditField').val();
    var description = $('#fieldDescriptionEditField').val();
    var public = false; //! template.find(".private").checked;
    var boundary = Session.get("createdFieldBoundary");
    var _id = Session.get("currentViewedField")._id;
    //if (title.length && description.length) {
    updateParty({
        _id: _id,
        title: title,
        description: description,
        boundary: boundary,
        public: public
    });
  $('#editDialogModal').modal('hide');
  Session.set('fieldsMenuOption', 'main');
};

