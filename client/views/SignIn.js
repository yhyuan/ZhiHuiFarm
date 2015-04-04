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
	Session.set("loadingPageOption", "SignIn");
//	$(window).ZhiHuiFarmUI = {};
	//Session.set("addFieldStep", 'firstStep');
});
/*
 Template.SignIn.events({
	'submit form': function(event, template){
	    event.preventDefault();
	    var loginEmail = template.find('#login-email').value;
	    var loginPassword = template.find('#login-password').value;

	    if ((loginEmail.length > 0) && (loginPassword.length > 0)&&(!Session.get("signup"))&&(!Session.get("forgetPassword"))) {
	    	Meteor.loginWithPassword(loginEmail, loginPassword);
	    } else {
			console.log("Unknown form is submitted.");
	    }
	}

});
*/
Template.SignIn.events({
  'submit #signInForm': function(e, t) {
    e.preventDefault();

    var signInForm = $(e.currentTarget),
          email = signInForm.find('#signInEmail').val(),
          password = signInForm.find('#signInPassword').val();
	if ((!email) || (!password)) {
		return false;
	}
	email = trimInput(email.toLowerCase());
    if (isNotEmpty(email) && isEmail(email) && isNotEmpty(password) && isValidPassword(password)) {

      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          console.log('These credentials are not valid.');
        } else {
          console.log('Welcome back Meteorite!');
        }
      });

    }
    return false;
  },
});

trimInput = function(value) {
    return value.replace(/^\s*|\s*$/g, '');
};

isNotEmpty = function(value) {
    if (value && value !== ''){
        return true;
    }
    console.log('Please fill in all required fields.');
    return false;
};

isEmail = function(value) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(value)) {
        return true;
    }
    console.log('Please enter a valid email address.');
    return false;
};

isValidPassword = function(password) {
    if (password.length < 6) {
        console.log('Your password should be 6 characters or longer.');
        return false;
    }
    return true;
};

areValidPasswords = function(password, confirm) {
    if (!isValidPassword(password)) {
        return false;
    }
    if (password !== confirm) {
        console.log('Your two passwords are not equivalent.');
        return false;
    }
    return true;
};
