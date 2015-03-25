 /*
http://bootsnipp.com/snippets/featured/full-page-sign-in
 */
 $(document).ready(function () {
    $('#signupButton').click(function(event) {
    	Session.set("signup", true);
    });
    Session.set("menuOption", 'menu');
});

 Template.login.events({
	'submit form': function(event, template){
	    event.preventDefault();
	    var loginEmail = template.find('#login-email').value;
	    var loginPassword = template.find('#login-password').value;

	    if ((loginEmail.length > 0) && (loginPassword.length > 0)) {
	    	Meteor.loginWithPassword(loginEmail, loginPassword);
	    } else {
			console.log("Unknown form is submitted.");
	    }
	}

});
