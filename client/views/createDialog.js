///////////////////////////////////////////////////////////////////////////////
// Create Party dialog
Template.createDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = false; //! template.find(".private").checked;
    var boundary = Session.get("createdFieldBoundary");
    if (title.length && description.length) {
      var id = createParty({
        title: title,
        description: description.split(";"),
        boundary: boundary,
        public: public
      });
      Session.set("fieldsMenuOption", 'main');
      Session.set("showCreateDialog", false);
    } else {
      Session.set("createError",
                  "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("fieldsMenuOption", 'main');
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.helpers({
  error: function () {
    return Session.get("createError");
  }
});

