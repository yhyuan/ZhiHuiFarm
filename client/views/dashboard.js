Template.dashboard.events({
    'click #logout': function(event){
        event.preventDefault();
        Meteor.logout();
    },
    'click #fieldsButton': function(event){
        event.preventDefault();
        Session.set("menuOption", 'fields');
    }    
});

Template.dashboard.helpers({
  menuOptionIs: function (menuOption) {
    return Session.get("menuOption") === menuOption;
  }
});
