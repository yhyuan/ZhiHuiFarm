Template.ForgotPassword.events({
  'submit #forgotPasswordForm': function(e, t) {
    e.preventDefault();

    var forgotPasswordForm = $(e.currentTarget),
        email = forgotPasswordForm.find('#forgotPasswordEmail').val();
	if (!email) {
		return false;
	}
	email = trimInput(email.toLowerCase());
	
    if (isNotEmpty(email) && isEmail(email)) {

      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            console.log('This email does not exist.');
          } else {
            console.log('We are sorry but something went wrong.');
          }
        } else {
          console.log('Email Sent. Check your mailbox.');
        }
      });

    }
    return false;
  },
});