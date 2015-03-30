if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
window.ZhiHuiFarmUI.confirmEditField = function () {
  
  
    //var title = template.find(".title").value;
    //var description = template.find(".description").value;
    var title = $('#fieldNameAddField').val();
    var description = $('#fieldStaffsAddField').val();
    var public = false; //! template.find(".private").checked;
    var boundary = Session.get("createdFieldBoundary");
    //if (title.length && description.length) {
      var id = createParty({
        title: title,
        description: description.split(";"),
        boundary: boundary,
        public: public
      });
  //
  //Session.set('fieldsMenuOption', 'main');
  //Session.set('showAddFieldDialog', false); 
  //Session.set("menuOption", 'fields');
  $('#createDialogModal').modal('hide');
  Session.set('fieldsMenuOption', 'main');
  //console.log(Session.get('fieldsMenuOption'));
};
