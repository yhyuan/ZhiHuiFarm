Template.loadingPage.helpers({
  loadingPageIs: function (loadingPageOption) {
    return Session.get("loadingPageOption") === loadingPageOption;
  }
});
/*
// (client-side)
Template.loginSignup.created = function() {
  if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
      if (err != null) {
        if (err.message = 'Verify email link expired [403]') {
          console.log('Sorry this verification link has expired.')
        }
      } else {
        console.log('Thank you! Your email address has been confirmed.')
      }
    });
  }
};

*/