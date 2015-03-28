 /*
http://bootsnipp.com/snippets/featured/full-page-sign-in
 */
 $(document).ready(function () {
    /*$('#signupButton').click(function(event) {
    	//alert('ok');
    	Session.set("signup", true);
    });*/
    $('#goBackButton').click(function(event) {
    	Session.set("menuOption", 'menu');
    });
    
    Session.set("menuOption", 'menu');
	Session.set("fieldsMenuOption", 'main');
	Session.set("showCreateDialog", false);
	L.Icon.Default.imagePath = 'images';
//	$(window).ZhiHuiFarmUI = {};
	//Session.set("addFieldStep", 'firstStep');
});

 Template.login.events({
	'submit form': function(event, template){
	    event.preventDefault();
	    var loginEmail = template.find('#login-email').value;
	    var loginPassword = template.find('#login-password').value;

	    if ((loginEmail.length > 0) && (loginPassword.length > 0)&&(!Session.get("signup"))&&(!Session.get("resetPassword"))) {
	    	Meteor.loginWithPassword(loginEmail, loginPassword);
	    } /*else {
			console.log("Unknown form is submitted.");
	    }*/
	}

});
