 /*
http://bootsnipp.com/snippets/featured/full-page-sign-in
 */
 
 Template.signup.events({
	'submit form': function(event, template){
		//console.log(event);
	    event.preventDefault();
	    var signupEmail = template.find('#signup-email').value;
	    var signupPassword1 = template.find('#signup-password1').value;
		var signupPassword2 = template.find('#signup-password2').value;

		if ((signupEmail.length > 0) && (signupPassword1.length > 0) && (signupPassword2.length > 0)) {
	    	if (signupPassword1 === signupPassword2) {
				Accounts.createUser({
				        email: signupEmail,
				        password: signupPassword1
				    });
				//Meteor.loginWithPassword(signupEmail, signupPassword1);
				Session.set("signup", false);
	    	} else {
	    		console.log("Password does not match.");
	    	}
	    } else {
			Session.set("signup", false);
	    }
	}

});
