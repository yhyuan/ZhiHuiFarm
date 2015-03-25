 /*
http://bootsnipp.com/snippets/featured/full-page-sign-in
 */
 $(document).ready(function () {
 	//$("#signup").hide();
    $('#signupButton').click(function(event) {
      $("#login").hide();
      $("#signup").show();
    }); 
});

 Template.login.events({
	'submit form': function(event, template){
	    event.preventDefault();
	    var loginEmail = template.find('#login-email').value;
	    var loginPassword = template.find('#login-password').value;

	    var signupEmail = template.find('#signup-email').value;
	    var signupPassword1 = template.find('#signup-password1').value;
		var signupPassword2 = template.find('#signup-password2').value;

	    if ((loginEmail.length > 0) && (loginPassword.length > 0)) {
	    	Meteor.loginWithPassword(loginEmail, loginPassword);
	    } else if ((signupEmail.length > 0) && (signupPassword1.length > 0) && (signupPassword2.length > 0)) {
	    	if (signupPassword1 === signupPassword2) {
				Accounts.createUser({
				        email: signupEmail,
				        password: signupPassword1
				    });	    		
	    	} else {
	    		console.log("Password does not match.");
	    	}
	    } else {
			console.log("Unknown form is submitted.");
	    }
	}

});
