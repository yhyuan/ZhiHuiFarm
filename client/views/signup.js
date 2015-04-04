 /*
http://bootsnipp.com/snippets/featured/full-page-sign-in
 */

Template.SignUp.events({
  'submit #signUpForm': function(e, t) {
    e.preventDefault();

    var signUpForm = $(e.currentTarget),
        email = signUpForm.find('#signUpEmail').val(),
        password = signUpForm.find('#signUpPassword').val(),
        passwordConfirm = signUpForm.find('#signUpPasswordConfirm').val();
	if ((!email) || (!password) || (!passwordConfirm)) {
		return false;
	}
	email = trimInput(email.toLowerCase());
	
    if (isNotEmpty(email) && isNotEmpty(password) && isEmail(email) && areValidPasswords(password, passwordConfirm)) {
      Accounts.createUser({email: email, password: password}, function(err) {
        if (err) {
          if (err.message === 'Email already exists. [403]') {
            console.log('We are sorry but this email is already used.');
          } else {
		    console.log(err);
            console.log('We are sorry but something went wrong.');
          }
        } else {
			//Meteor.loginWithPassword(email, password);
			Session.set("loadingPageOption", 'SignIn');
			console.log('Congrats new Meteorite, you\'re in!');
        }
      });

    }
    return false;
  },
});
