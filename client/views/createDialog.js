///////////////////////////////////////////////////////////////////////////////
// Create Party dialog
/*
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
*/
if (!window.ZhiHuiFarmUI) {
    window.ZhiHuiFarmUI = {};
}
window.ZhiHuiFarmUI.confirmAddField = function () {
  
  
    //var title = template.find(".title").value;
    //var description = template.find(".description").value;
    var title = $('#fieldNameAddField').val();
    var description = $('#fieldDescription').val();
    var public = false; //! template.find(".private").checked;
    var boundary = Session.get("createdFieldBoundary");

    var geojsonFeatureCollection = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              _.map(boundary.concat([boundary[0]]), function(latlng) {return [latlng.lng, latlng.lat]})
            ]
          },
          "properties": {
            "title": title
          }
        }
      ]
    };

    //if (title.length && description.length) {
      var id = createParty({
        title: title,
        description: description,
        boundary: geojsonFeatureCollection//,
        //public: public
      });
  $('#createDialogModal').modal('hide');
  Session.set('fieldsMenuOption', 'main');
};

